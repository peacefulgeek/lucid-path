/**
 * refresh-quarterly.mjs
 * Quarterly deep refresh — 1st of Jan/Apr/Jul/Oct 04:00 UTC.
 * 1. Full ASIN verification + title updates from Amazon.
 * 2. Quality audit of oldest 20 articles.
 * 3. Regenerate flagged articles via DeepSeek V4-Pro.
 */

import OpenAI from 'openai';
import { verifyAsinBatch, buildAmazonUrl, extractAsinsFromText } from '../../src/lib/amazon-verify.mjs';
import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import fs from 'fs';
import path from 'path';

const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

function loadCatalog() {
  const catalogPath = path.resolve(import.meta.dirname, '../../client/src/lib/product-catalog.ts');
  const raw = fs.readFileSync(catalogPath, 'utf-8');
  const products = [];
  const regex = /\{\s*name:\s*"([^"]+)",\s*asin:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(raw)) !== null) {
    products.push({ name: m[1], asin: m[2], category: m[3] });
  }
  return products;
}

export async function refreshQuarterly() {
  console.log('[quarterly] Starting quarterly deep refresh...');

  // 1. Full ASIN verification
  const catalog = loadCatalog();
  const results = await verifyAsinBatch(catalog.map(p => p.asin), 2500);
  const active = results.filter(r => r.valid);
  const dead = results.filter(r => !r.valid);

  console.log(`[quarterly] ASIN check: ${active.length} active, ${dead.length} dead`);

  // 2. Update product catalog titles from Amazon
  let titlesUpdated = 0;
  const catalogPath = path.resolve(import.meta.dirname, '../../client/src/lib/product-catalog.ts');
  let catalogSource = fs.readFileSync(catalogPath, 'utf-8');

  for (const result of active) {
    if (result.title) {
      const existing = catalog.find(p => p.asin === result.asin);
      if (existing && existing.name !== result.title && result.title.length > 10) {
        const escapedTitle = result.title.replace(/"/g, '\\"');
        const oldPattern = new RegExp(`name:\\s*"[^"]*",\\s*asin:\\s*"${result.asin}"`);
        const newValue = `name: "${escapedTitle}", asin: "${result.asin}"`;
        if (oldPattern.test(catalogSource)) {
          catalogSource = catalogSource.replace(oldPattern, newValue);
          titlesUpdated++;
        }
      }
    }
  }

  if (titlesUpdated > 0) {
    fs.writeFileSync(catalogPath, catalogSource);
    console.log(`[quarterly] Updated ${titlesUpdated} product titles`);
  }

  // 3. Swap dead ASINs in articles
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  let data;
  try { data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8')); } catch { return { error: 'no-articles' }; }

  const deadSet = new Set(dead.map(d => d.asin));
  const activeSet = new Set(active.map(a => a.asin));
  let swapped = 0;

  for (const art of (data.articles || [])) {
    const body = art.body || '';
    const asins = extractAsinsFromText(body);
    const deadInArticle = asins.filter(a => deadSet.has(a));
    if (deadInArticle.length > 0) {
      let newBody = body;
      for (const deadAsin of deadInArticle) {
        const existing = new Set(extractAsinsFromText(newBody));
        const replacement = catalog.find(p => activeSet.has(p.asin) && !existing.has(p.asin) && !deadSet.has(p.asin));
        if (replacement) {
          newBody = newBody.replace(new RegExp(`https://www\\.amazon\\.com/dp/${deadAsin}[^"]*`, 'g'), buildAmazonUrl(replacement.asin));
          swapped++;
        }
      }
      art.body = newBody;
    }
  }

  // 4. Quality audit oldest 20 articles + regenerate flagged ones
  const sorted = [...(data.articles || [])]
    .filter(a => a.status === 'published' || !a.status)
    .sort((a, b) => (a.dateISO || '').localeCompare(b.dateISO || ''));

  const flagged = [];
  let regenerated = 0;

  for (const art of sorted.slice(0, 20)) {
    const body = art.body || '';
    if (!body) continue;
    const gate = runQualityGate(body);
    if (!gate.passed) {
      flagged.push({ slug: art.slug, title: art.title, failures: gate.failures });

      // Try to regenerate via DeepSeek
      if (process.env.OPENAI_API_KEY) {
        try {
          const catalogSnippet = catalog.slice(0, 15).map(p => `- ${p.name} (ASIN: ${p.asin})`).join('\n');
          const response = await client.chat.completions.create({
            model: MODEL,
            messages: [
              {
                role: 'system',
                content: `You are rewriting a lucid dreaming article for The Lucid Path blog. The previous version failed quality checks. Write a completely fresh version on the same topic.

Available Amazon products:
${catalogSnippet}

Amazon link format: <a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

${GENERATION_HARD_RULES}`
              },
              {
                role: 'user',
                content: `Rewrite this article titled "${art.title}" (category: ${art.category || 'the-basics'}). Return as HTML with <h1> title.`
              }
            ],
            temperature: 0.72
          });

          const newBody = response.choices[0]?.message?.content || '';
          const newGate = runQualityGate(newBody);
          if (newGate.passed) {
            const idx = data.articles.findIndex(a => a.slug === art.slug);
            if (idx !== -1) {
              data.articles[idx].body = newGate.body;
              data.articles[idx].wordCount = newGate.wordCount;
              data.articles[idx].amazonLinks = newGate.amazonLinks;
              data.articles[idx].refreshedAt = new Date().toISOString();
              regenerated++;
              console.log(`[quarterly] Regenerated: ${art.slug}`);
            }
          }
        } catch (e) {
          console.error(`[quarterly] Regen error for ${art.slug}:`, e.message);
        }
      }
    }
  }

  fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));

  // Write report
  const reportDir = path.resolve(import.meta.dirname, '../reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, `quarterly-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({
      date: new Date().toISOString(),
      asinCheck: { active: active.length, dead: dead.length },
      titlesUpdated, swapped, flagged: flagged.length, regenerated,
      flaggedArticles: flagged
    }, null, 2)
  );

  console.log(`[quarterly] Done. Swapped ${swapped}, flagged ${flagged.length}, regenerated ${regenerated}`);
  return { active: active.length, dead: dead.length, titlesUpdated, swapped, flagged: flagged.length, regenerated };
}
