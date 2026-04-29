/**
 * refresh-monthly.mjs
 * Monthly content refresh — 1st of month 03:00 UTC.
 * 1. Re-checks all ASINs in articles, swaps dead ones.
 * 2. Refreshes the 5 oldest published articles via DeepSeek V4-Pro.
 */

import OpenAI from 'openai';
import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import { verifyAsinBatch, extractAsinsFromText, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
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

export async function refreshMonthly() {
  console.log('[monthly] Starting monthly content refresh...');

  const catalog = loadCatalog();
  const allAsins = catalog.map(p => p.asin);
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  let data;
  try { data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8')); } catch { return { refreshed: 0, swapped: 0 }; }

  // ─── STEP 1: ASIN health check and swap ───
  const results = await verifyAsinBatch(allAsins, 2500);
  const active = results.filter(r => r.valid);
  const dead = results.filter(r => !r.valid);
  const deadSet = new Set(dead.map(d => d.asin));
  const activeSet = new Set(active.map(a => a.asin));
  let swapped = 0;

  console.log(`[monthly] ${active.length} active, ${dead.length} dead out of ${allAsins.length}`);

  if (dead.length > 0) {
    for (const art of (data.articles || [])) {
      const body = art.body || '';
      const asins = extractAsinsFromText(body);
      const deadInArticle = asins.filter(a => deadSet.has(a));

      if (deadInArticle.length > 0) {
        let newBody = body;
        for (const deadAsin of deadInArticle) {
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
  }

  // ─── STEP 2: Content refresh of 5 oldest articles ───
  let refreshed = 0;

  if (process.env.OPENAI_API_KEY) {
    const published = (data.articles || [])
      .filter(a => a.status === 'published' || !a.status)
      .sort((a, b) => new Date(a.dateISO || 0) - new Date(b.dateISO || 0));

    const toRefresh = published.slice(0, 5);
    const catalogSnippet = catalog.slice(0, 15).map(p => `- ${p.name} (ASIN: ${p.asin})`).join('\n');

    for (const article of toRefresh) {
      try {
        const response = await client.chat.completions.create({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: `You are refreshing an existing lucid dreaming article for The Lucid Path blog. Keep the same topic and angle but rewrite with fresh examples, updated information, and improved flow.

Available Amazon products:
${catalogSnippet}

Amazon link format: <a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

${GENERATION_HARD_RULES}`
            },
            {
              role: 'user',
              content: `Refresh this article titled "${article.title}" (category: ${article.category || 'the-basics'}). Write a completely new version covering the same topic. Return as HTML with <h1> title.`
            }
          ],
          temperature: 0.72
        });

        const body = response.choices[0]?.message?.content || '';
        const gate = runQualityGate(body);

        if (gate.passed) {
          const idx = data.articles.findIndex(a => a.slug === article.slug);
          if (idx !== -1) {
            data.articles[idx].body = gate.body;
            data.articles[idx].wordCount = gate.wordCount;
            data.articles[idx].amazonLinks = gate.amazonLinks;
            data.articles[idx].refreshedAt = new Date().toISOString();
            refreshed++;
            console.log(`[monthly] Refreshed: ${article.slug}`);
          }
        } else {
          console.warn(`[monthly] Quality gate failed for ${article.slug}:`, gate.failures.join(' | '));
        }
      } catch (e) {
        console.error(`[monthly] Error refreshing ${article.slug}:`, e.message);
      }
    }
  }

  fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));

  // Write report
  const reportDir = path.resolve(import.meta.dirname, '../reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportDir, `monthly-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify({ date: new Date().toISOString(), active: active.length, dead: dead.length, swapped, refreshed }, null, 2)
  );

  console.log(`[monthly] Done. Swapped ${swapped} dead links, refreshed ${refreshed} articles`);
  return { swapped, refreshed };
}
