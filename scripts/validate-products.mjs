#!/usr/bin/env node
/**
 * validate-products.mjs
 * Lightweight Amazon ASIN validation — no API keys required.
 *
 * Strategy:
 *   1. HTTP GET each Amazon product page (https://www.amazon.com/dp/{ASIN})
 *   2. Check response status (200 = live, 404/503 = broken, redirect = investigate)
 *   3. Scrape <title> tag for product name verification
 *   4. Detect "Currently unavailable" / "Page not found" signals
 *   5. Generate a validation report and update product-catalog.ts + articles.json
 *
 * Runs on a cron schedule (Sundays at 06:00 UTC) via cron-worker.mjs
 * Can also be run manually: node scripts/validate-products.mjs
 *
 * Rate limiting: 2-second delay between requests to avoid Amazon throttling.
 * Retry logic: up to 2 retries with exponential backoff on failures.
 * User-Agent rotation to reduce blocking risk.
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── Configuration ───
const AFFILIATE_TAG = "spankyspinola-20";
const REQUEST_DELAY_MS = 2500;   // 2.5s between requests
const REQUEST_TIMEOUT_MS = 15000; // 15s per request
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 5000;

// Paths
const CATALOG_PATH = path.join(ROOT, "client/src/lib/product-catalog.ts");
const ARTICLES_PATH = path.join(ROOT, "client/src/data/articles.json");
const REPORT_DIR = path.join(ROOT, "scripts/reports");
const REPORT_PATH = path.join(REPORT_DIR, "product-validation-report.json");
const LOG_PATH = path.join(REPORT_DIR, "product-validation.log");

// User-Agent rotation pool (common browser UAs)
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

// ─── Logging ───
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  ensureDir(REPORT_DIR);
  fs.appendFileSync(LOG_PATH, line + "\n");
}

// ─── HTTP Request Helper ───
function fetchPage(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      return resolve({ status: 0, body: "", error: "Too many redirects" });
    }

    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    const req = client.get(url, {
      headers: {
        "User-Agent": randomUA(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
      },
      timeout: REQUEST_TIMEOUT_MS,
    }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith("/")) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        res.resume(); // Drain the response
        return fetchPage(redirectUrl, redirectCount + 1).then(resolve).catch(reject);
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf-8");
        resolve({
          status: res.statusCode,
          body,
          finalUrl: url,
          error: null,
        });
      });
    });

    req.on("error", (err) => {
      resolve({ status: 0, body: "", error: err.message });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, body: "", error: "Request timeout" });
    });
  });
}

// ─── Parse Amazon Page ───
function parseAmazonPage(html, asin) {
  const result = {
    titleFromPage: null,
    isAvailable: true,
    isDogsPage: false,
    isNotFound: false,
    isCaptcha: false,
    priceText: null,
  };

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch) {
    const rawTitle = titleMatch[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    result.titleFromPage = rawTitle;

    // Amazon's "dogs of Amazon" 404 page
    if (rawTitle.toLowerCase().includes("page not found") || rawTitle.toLowerCase().includes("sorry")) {
      result.isDogsPage = true;
      result.isNotFound = true;
      result.isAvailable = false;
    }
  }

  // Check for CAPTCHA / robot check
  if (html.includes("Type the characters you see in this image") ||
      html.includes("Enter the characters you see below") ||
      html.includes("api-services-support@amazon.com")) {
    result.isCaptcha = true;
    // Don't mark as unavailable — it's a rate limit, not a dead product
  }

  // Check for "Currently unavailable" signals
  const unavailablePatterns = [
    "Currently unavailable",
    "This item is no longer available",
    "We don't know when or if this item will be back in stock",
  ];
  for (const pattern of unavailablePatterns) {
    if (html.includes(pattern)) {
      result.isAvailable = false;
      break;
    }
  }

  // Try to extract price (best effort)
  const pricePatterns = [
    /class="a-price-whole"[^>]*>(\d+)<.*?class="a-price-fraction"[^>]*>(\d+)</s,
    /\$(\d+)\.(\d{2})/,
  ];
  for (const pat of pricePatterns) {
    const m = html.match(pat);
    if (m) {
      result.priceText = `$${m[1]}.${m[2]}`;
      break;
    }
  }

  return result;
}

// ─── Extract Product Name from Title ───
function extractProductName(pageTitle) {
  if (!pageTitle) return null;
  // Amazon titles are usually: "Product Name : Amazon.com" or "Amazon.com : Product Name"
  // or "Product Name - Amazon.com"
  let name = pageTitle
    .replace(/\s*[-:|]\s*Amazon\.com.*$/i, "")
    .replace(/^Amazon\.com\s*[-:|]\s*/i, "")
    .replace(/\s*:\s*[\w\s]*$/, "")
    .trim();

  // If it's too short or is just "Amazon", it's not useful
  if (name.length < 5 || name.toLowerCase().startsWith("amazon")) return null;
  return name;
}

// ─── Sleep helper ───
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Read current product catalog ASINs from TS file ───
function readCatalogASINs() {
  const content = fs.readFileSync(CATALOG_PATH, "utf-8");
  const asinMatches = [...content.matchAll(/asin:\s*"([A-Z0-9]{10})"/g)];
  return asinMatches.map((m) => m[1]);
}

// ─── Read ASINs from articles.json ───
function readArticleASINs() {
  const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
  const data = JSON.parse(raw);
  const articles = data.articles || data;
  const asinSet = new Set();

  for (const article of articles) {
    const body = article.body || "";
    const matches = [...body.matchAll(/amazon\.com\/dp\/([A-Z0-9]{10})/g)];
    for (const m of matches) {
      asinSet.add(m[1]);
    }
  }
  return [...asinSet];
}

// ─── Main Validation ───
async function validateASIN(asin, retryCount = 0) {
  const url = `https://www.amazon.com/dp/${asin}`;

  try {
    const { status, body, error } = await fetchPage(url);

    if (error) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * (retryCount + 1);
        log(`  ⚠ ${asin}: Error "${error}" — retrying in ${delay / 1000}s (attempt ${retryCount + 2}/${MAX_RETRIES + 1})`);
        await sleep(delay);
        return validateASIN(asin, retryCount + 1);
      }
      return {
        asin,
        status: "error",
        httpStatus: 0,
        error,
        titleFromPage: null,
        extractedName: null,
        isAvailable: null,
        isCaptcha: false,
        priceText: null,
        checkedAt: new Date().toISOString(),
      };
    }

    const parsed = parseAmazonPage(body, asin);

    // If we got a CAPTCHA, retry with longer delay
    if (parsed.isCaptcha && retryCount < MAX_RETRIES) {
      const delay = RETRY_BASE_DELAY_MS * (retryCount + 2);
      log(`  🤖 ${asin}: CAPTCHA detected — retrying in ${delay / 1000}s`);
      await sleep(delay);
      return validateASIN(asin, retryCount + 1);
    }

    const extractedName = extractProductName(parsed.titleFromPage);

    let validationStatus;
    if (status === 404 || parsed.isNotFound) {
      validationStatus = "not_found";
    } else if (parsed.isCaptcha) {
      validationStatus = "captcha_blocked";
    } else if (!parsed.isAvailable) {
      validationStatus = "unavailable";
    } else if (status === 200) {
      validationStatus = "active";
    } else {
      validationStatus = "unknown";
    }

    return {
      asin,
      status: validationStatus,
      httpStatus: status,
      error: null,
      titleFromPage: parsed.titleFromPage,
      extractedName,
      isAvailable: parsed.isAvailable,
      isCaptcha: parsed.isCaptcha,
      priceText: parsed.priceText,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      asin,
      status: "error",
      httpStatus: 0,
      error: err.message,
      titleFromPage: null,
      extractedName: null,
      isAvailable: null,
      isCaptcha: false,
      priceText: null,
      checkedAt: new Date().toISOString(),
    };
  }
}

// ─── Update Product Catalog with Fresh Titles ───
function updateCatalogTitles(results) {
  let content = fs.readFileSync(CATALOG_PATH, "utf-8");
  let updatedCount = 0;

  for (const r of results) {
    if (r.status !== "active" || !r.extractedName) continue;

    // Find the line with this ASIN and update the name if significantly different
    const asinPattern = new RegExp(
      `(\\{\\s*name:\\s*)"([^"]*)"(,\\s*asin:\\s*"${r.asin}")`,
      "g"
    );

    content = content.replace(asinPattern, (match, prefix, oldName, suffix) => {
      // Only update if the extracted name is meaningfully different
      const oldLower = oldName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const newLower = r.extractedName.toLowerCase().replace(/[^a-z0-9]/g, "");

      // Skip if names are essentially the same (>80% overlap)
      if (oldLower === newLower) return match;

      // Don't replace with shorter/worse names
      if (r.extractedName.length < 10) return match;

      updatedCount++;
      log(`  📝 Updated title for ${r.asin}: "${oldName}" → "${r.extractedName}"`);
      return `${prefix}"${r.extractedName.replace(/"/g, '\\"')}"${suffix}`;
    });
  }

  if (updatedCount > 0) {
    fs.writeFileSync(CATALOG_PATH, content, "utf-8");
    log(`📝 Updated ${updatedCount} product titles in catalog`);
  }

  return updatedCount;
}

// ─── Flag Broken Links in Articles ───
function flagBrokenLinksInArticles(brokenASINs) {
  if (brokenASINs.length === 0) return 0;

  const raw = fs.readFileSync(ARTICLES_PATH, "utf-8");
  const data = JSON.parse(raw);
  const articles = data.articles || data;
  let totalFixed = 0;

  const brokenSet = new Set(brokenASINs);

  for (const article of articles) {
    let body = article.body || "";
    let modified = false;

    for (const asin of brokenSet) {
      // Find and comment out broken links by wrapping in <del> with a note
      const linkPattern = new RegExp(
        `<a[^>]*href="https://www\\.amazon\\.com/dp/${asin}[^"]*"[^>]*>(.*?)</a>\\s*<em>\\(paid link\\)</em>`,
        "gi"
      );

      if (linkPattern.test(body)) {
        body = body.replace(linkPattern, (match, linkText) => {
          totalFixed++;
          modified = true;
          // Replace broken link with plain text + note
          return `${linkText} <em>(product currently unavailable)</em>`;
        });
      }
    }

    if (modified) {
      article.body = body;
    }
  }

  if (totalFixed > 0) {
    const outputData = data.articles ? data : { articles: data };
    fs.writeFileSync(ARTICLES_PATH, JSON.stringify(outputData), "utf-8");
    log(`🔗 Flagged ${totalFixed} broken links across articles`);
  }

  return totalFixed;
}

// ─── Generate Report ───
function generateReport(results, titleUpdates, brokenFixed) {
  const active = results.filter((r) => r.status === "active");
  const unavailable = results.filter((r) => r.status === "unavailable");
  const notFound = results.filter((r) => r.status === "not_found");
  const captchaBlocked = results.filter((r) => r.status === "captcha_blocked");
  const errors = results.filter((r) => r.status === "error");
  const withPrices = results.filter((r) => r.priceText);

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalChecked: results.length,
      active: active.length,
      unavailable: unavailable.length,
      notFound: notFound.length,
      captchaBlocked: captchaBlocked.length,
      errors: errors.length,
      pricesFound: withPrices.length,
      titlesUpdated: titleUpdates,
      brokenLinksFixed: brokenFixed,
    },
    issues: [
      ...notFound.map((r) => ({
        asin: r.asin,
        severity: "critical",
        issue: "Product page not found (404)",
        action: "Remove or replace this ASIN",
      })),
      ...unavailable.map((r) => ({
        asin: r.asin,
        severity: "warning",
        issue: "Product currently unavailable",
        action: "Monitor — may return to stock",
      })),
      ...errors.map((r) => ({
        asin: r.asin,
        severity: "info",
        issue: `Request error: ${r.error}`,
        action: "Will retry next validation cycle",
      })),
      ...captchaBlocked.map((r) => ({
        asin: r.asin,
        severity: "info",
        issue: "CAPTCHA blocked — could not verify",
        action: "Will retry next validation cycle",
      })),
    ],
    products: results,
  };

  ensureDir(REPORT_DIR);
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  return report;
}

// ─── Main Entry Point ───
export async function validateProducts() {
  log("═══════════════════════════════════════════");
  log("🔍 Starting product validation...");
  log("═══════════════════════════════════════════");

  // Collect all unique ASINs from catalog + articles
  const catalogASINs = readCatalogASINs();
  const articleASINs = readArticleASINs();
  const allASINs = [...new Set([...catalogASINs, ...articleASINs])];

  log(`📦 Found ${catalogASINs.length} catalog ASINs, ${articleASINs.length} article ASINs`);
  log(`📦 ${allASINs.length} unique ASINs to validate`);

  const results = [];
  let checked = 0;

  for (const asin of allASINs) {
    checked++;
    log(`[${checked}/${allASINs.length}] Checking ${asin}...`);

    const result = await validateASIN(asin);
    results.push(result);

    const statusIcon = {
      active: "✅",
      unavailable: "⚠️",
      not_found: "❌",
      captcha_blocked: "🤖",
      error: "💥",
      unknown: "❓",
    }[result.status] || "❓";

    const priceInfo = result.priceText ? ` | ${result.priceText}` : "";
    const nameInfo = result.extractedName ? ` | "${result.extractedName.substring(0, 50)}..."` : "";
    log(`  ${statusIcon} ${asin}: ${result.status} (HTTP ${result.httpStatus})${priceInfo}${nameInfo}`);

    // Rate limiting delay
    if (checked < allASINs.length) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  // Phase 2: Update catalog titles
  log("\n📝 Updating product catalog titles...");
  const titleUpdates = updateCatalogTitles(results);

  // Phase 3: Flag broken links
  const brokenASINs = results
    .filter((r) => r.status === "not_found")
    .map((r) => r.asin);

  log("\n🔗 Flagging broken links in articles...");
  const brokenFixed = flagBrokenLinksInArticles(brokenASINs);

  // Phase 4: Generate report
  const report = generateReport(results, titleUpdates, brokenFixed);

  log("\n═══════════════════════════════════════════");
  log("📊 VALIDATION REPORT SUMMARY");
  log("═══════════════════════════════════════════");
  log(`  Total checked:     ${report.summary.totalChecked}`);
  log(`  Active:            ${report.summary.active}`);
  log(`  Unavailable:       ${report.summary.unavailable}`);
  log(`  Not found (404):   ${report.summary.notFound}`);
  log(`  CAPTCHA blocked:   ${report.summary.captchaBlocked}`);
  log(`  Errors:            ${report.summary.errors}`);
  log(`  Prices found:      ${report.summary.pricesFound}`);
  log(`  Titles updated:    ${report.summary.titlesUpdated}`);
  log(`  Broken links fixed: ${report.summary.brokenLinksFixed}`);
  log(`  Report saved to:   ${REPORT_PATH}`);
  log("═══════════════════════════════════════════");

  return report;
}

// ─── CLI Execution ───
if (process.argv[1] && process.argv[1].endsWith("validate-products.mjs")) {
  validateProducts()
    .then((report) => {
      if (report.summary.notFound > 0 || report.summary.unavailable > 0) {
        log("\n⚠️  ACTION REQUIRED: Some products need attention. Check the report.");
        process.exit(1);
      }
      process.exit(0);
    })
    .catch((err) => {
      log(`💥 Fatal error: ${err.message}`);
      process.exit(1);
    });
}
