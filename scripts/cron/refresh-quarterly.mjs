/**
 * refresh-quarterly.mjs
 * Quarterly deep content refresh: re-verifies all ASINs,
 * updates product catalog titles from Amazon, and runs
 * quality gate on oldest articles for potential regeneration.
 */

import { verifyAsinBatch, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
import { runQualityGate } from '../../src/lib/article-quality-gate.mjs';
import fs from 'fs';
import path from 'path';

function loadCatalogAsins() {
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
  console.log('[refresh-quarterly] Starting quarterly deep refresh...');

  // 1. Full ASIN verification
  const catalog = loadCatalogAsins();
  const results = await verifyAsinBatch(catalog.map(p => p.asin), 2500);
  const active = results.filter(r => r.valid);
  const dead = results.filter(r => !r.valid);

  console.log(`[refresh-quarterly] ASIN check: ${active.length} active, ${dead.length} dead`);

  // 2. Update product catalog titles from Amazon
  let titlesUpdated = 0;
  const catalogPath = path.resolve(import.meta.dirname, '../../client/src/lib/product-catalog.ts');
  let catalogSource = fs.readFileSync(catalogPath, 'utf-8');

  for (const result of active) {
    if (result.title) {
      const existing = catalog.find(p => p.asin === result.asin);
      if (existing && existing.name !== result.title && result.title.length > 10) {
        // Only update if the Amazon title is meaningfully different
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
    console.log(`[refresh-quarterly] Updated ${titlesUpdated} product titles from Amazon`);
  }

  // 3. Run quality gate on oldest 20 articles to flag for regeneration
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const articles = data.articles;

  // Sort by dateISO ascending (oldest first)
  const sorted = [...articles].sort((a, b) =>
    (a.dateISO || '').localeCompare(b.dateISO || '')
  );

  const flagged = [];
  for (const art of sorted.slice(0, 20)) {
    const body = art.body || '';
    if (!body) continue;
    const gate = runQualityGate(body);
    if (!gate.passed) {
      flagged.push({
        slug: art.slug,
        title: art.title,
        failures: gate.failures
      });
    }
  }

  console.log(`[refresh-quarterly] ${flagged.length} of 20 oldest articles flagged for regeneration`);

  // 4. Write report
  const reportDir = path.resolve(import.meta.dirname, '../reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, `quarterly-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({
      date: new Date().toISOString(),
      asinCheck: { active: active.length, dead: dead.length, deadAsins: dead },
      titlesUpdated,
      qualityAudit: { checked: 20, flagged: flagged.length, articles: flagged }
    }, null, 2)
  );

  return { active: active.length, dead: dead.length, titlesUpdated, flagged: flagged.length };
}
