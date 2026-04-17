/**
 * product-spotlight.mjs
 * Weekly product spotlight article generation.
 * Picks a product from the catalog and generates a focused review article.
 */

import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import { verifyAsin, extractAsinsFromText, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
import fs from 'fs';
import path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

function loadCatalog() {
  try {
    const catalogPath = path.resolve(import.meta.dirname, '../../client/src/lib/product-catalog.ts');
    const raw = fs.readFileSync(catalogPath, 'utf-8');
    const products = [];
    const regex = /\{\s*name:\s*"([^"]+)",\s*asin:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
    let m;
    while ((m = regex.exec(raw)) !== null) {
      products.push({ name: m[1], asin: m[2], category: m[3] });
    }
    return products;
  } catch (e) {
    console.error('[spotlight] Failed to load catalog:', e);
    return [];
  }
}

export async function generateProductSpotlight() {
  if (!ANTHROPIC_API_KEY) {
    console.error('[spotlight] ANTHROPIC_API_KEY not set');
    return { stored: false, reason: 'no-api-key' };
  }

  const catalog = loadCatalog();
  if (catalog.length === 0) return { stored: false, reason: 'empty-catalog' };

  // Pick a random product to spotlight
  const product = catalog[Math.floor(Math.random() * catalog.length)];
  const verified = await verifyAsin(product.asin);

  if (!verified.valid) {
    console.warn(`[spotlight] Product ${product.asin} is invalid: ${verified.reason}`);
    return { stored: false, reason: 'product-invalid' };
  }

  // Generate spotlight article with quality gate
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const relatedProducts = catalog
        .filter(p => p.category === product.category && p.asin !== product.asin)
        .slice(0, 5);

      const allProducts = [product, ...relatedProducts];
      const catalogSnippet = allProducts.map(p => `- ${p.name} (ASIN: ${p.asin})`).join('\n');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: `You are a lucid dreaming expert writing a product spotlight review for The Lucid Path blog. Focus on "${product.name}" as the main product, but naturally mention 2-3 related products.

Available products:
${catalogSnippet}

Amazon link format: https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}

${GENERATION_HARD_RULES}`,
          messages: [{
            role: 'user',
            content: `Write a product spotlight review article about "${product.name}" for lucid dreamers. Explain how it helps with lucid dreaming practice, who it's best for, and how to use it effectively. Return as HTML with <h1> title.`
          }]
        })
      });

      if (!res.ok) throw new Error(`Anthropic ${res.status}`);
      const data = await res.json();
      const body = data.content[0]?.text || '';

      const gate = runQualityGate(body);
      if (gate.passed) {
        const titleMatch = body.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : `Product Spotlight: ${product.name}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
        let articles = {};
        try { articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8')); } catch {}

        articles[slug] = {
          title, slug, category: product.category, body,
          publishedAt: new Date().toISOString(),
          type: 'product-spotlight',
          spotlightAsin: product.asin,
          wordCount: gate.wordCount,
          amazonLinks: gate.amazonLinks
        };

        fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
        console.log(`[spotlight] stored ${slug} (${gate.wordCount} words)`);
        return { stored: true, attempts: attempt };
      }

      console.warn(`[spotlight] attempt ${attempt} failed:`, gate.failures.join(' | '));
    } catch (e) {
      console.error(`[spotlight] attempt ${attempt} error:`, e.message);
    }
  }

  return { stored: false, reason: 'quality-gate-exhausted' };
}
