/**
 * refresh-monthly.mjs
 * Monthly content refresh: re-checks all ASINs in articles,
 * swaps dead ones, and updates the product catalog.
 */

import { verifyAsinBatch, extractAsinsFromText, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
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

export async function refreshMonthly() {
  console.log('[refresh-monthly] Starting monthly content refresh...');

  const catalog = loadCatalogAsins();
  const allAsins = catalog.map(p => p.asin);

  // Verify all catalog ASINs
  const results = await verifyAsinBatch(allAsins, 2500);
  const active = results.filter(r => r.valid);
  const dead = results.filter(r => !r.valid);

  console.log(`[refresh-monthly] ${active.length} active, ${dead.length} dead out of ${allAsins.length}`);

  if (dead.length === 0) {
    console.log('[refresh-monthly] All ASINs healthy, nothing to do');
    return { active: active.length, dead: 0, swapped: 0 };
  }

  // Log dead ASINs
  for (const d of dead) {
    console.warn(`[refresh-monthly] DEAD: ${d.asin} — ${d.reason}`);
  }

  // Swap dead ASINs in articles
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  const deadSet = new Set(dead.map(d => d.asin));
  const activeSet = new Set(active.map(a => a.asin));
  let swapped = 0;

  for (const art of data.articles) {
    const body = art.body || '';
    const asins = extractAsinsFromText(body);
    const deadInArticle = asins.filter(a => deadSet.has(a));

    if (deadInArticle.length > 0) {
      let newBody = body;
      for (const deadAsin of deadInArticle) {
        // Find replacement from active set not already in this article
        const existing = new Set(extractAsinsFromText(newBody));
        const replacement = catalog.find(p =>
          activeSet.has(p.asin) && !existing.has(p.asin) && !deadSet.has(p.asin)
        );
        if (replacement) {
          const re = new RegExp(`https://www\\.amazon\\.com/dp/${deadAsin}[^"]*`, 'g');
          newBody = newBody.replace(re, buildAmazonUrl(replacement.asin));
          swapped++;
        }
      }
      art.body = newBody;
    }
  }

  fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
  console.log(`[refresh-monthly] Swapped ${swapped} dead links in articles`);

  // Write report
  const reportDir = path.resolve(import.meta.dirname, '../reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, `monthly-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({ date: new Date().toISOString(), active: active.length, dead: dead.length, swapped, deadAsins: dead }, null, 2)
  );

  return { active: active.length, dead: dead.length, swapped };
}
