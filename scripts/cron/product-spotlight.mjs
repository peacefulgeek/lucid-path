/**
 * product-spotlight.mjs
 * Weekly product spotlight — Saturdays 08:00 UTC.
 * Generates a review of a verified ASIN using DeepSeek V4-Pro.
 * Uses assignHeroImage(). Inserts directly as status='published'.
 */

import OpenAI from 'openai';
import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import { verifyAsin } from '../../src/lib/amazon-verify.mjs';
import { assignHeroImage } from '../../src/lib/image-pipeline.mjs';
import fs from 'fs';
import path from 'path';

const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

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
  if (!process.env.OPENAI_API_KEY) {
    console.error('[spotlight] OPENAI_API_KEY not set');
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

  // 4-attempt quality gate
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const relatedProducts = catalog
        .filter(p => p.category === product.category && p.asin !== product.asin)
        .slice(0, 5);

      const allProducts = [product, ...relatedProducts];
      const catalogSnippet = allProducts.map(p => `- ${p.name} (ASIN: ${p.asin})`).join('\n');

      const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a lucid dreaming expert writing a product spotlight review for The Lucid Path blog. Focus on "${product.name}" as the main product, but naturally mention 2-3 related products.

Available products:
${catalogSnippet}

Amazon link format: <a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

${GENERATION_HARD_RULES}`
          },
          {
            role: 'user',
            content: `Write a product spotlight review article about "${product.name}" for lucid dreamers. Explain how it helps with lucid dreaming practice, who it's best for, and how to use it effectively. Return as HTML with <h1> title.`
          }
        ],
        temperature: 0.72
      });

      const body = response.choices[0]?.message?.content || '';
      const gate = runQualityGate(body);

      if (gate.passed) {
        const titleMatch = body.match(/<h1[^>]*>(.*?)<\/h1>/i);
        const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : `Product Spotlight: ${product.name}`;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

        // Assign hero image
        const heroImage = await assignHeroImage(slug);

        // Store as published
        const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
        let data = {};
        try { data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8')); } catch {}
        if (!data.articles) data.articles = [];

        data.articles.push({
          title, slug, category: product.category,
          body: gate.body,
          status: 'published',
          published_at: new Date().toISOString(),
          queued_at: new Date().toISOString(),
          dateISO: new Date().toISOString().split('T')[0],
          heroImage, ogImage: heroImage,
          type: 'product-spotlight',
          spotlightAsin: product.asin,
          wordCount: gate.wordCount,
          amazonLinks: gate.amazonLinks
        });

        fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
        console.log(`[spotlight] Published: ${slug} (${gate.wordCount} words)`);
        return { stored: true, attempts: attempt };
      }

      console.warn(`[spotlight] attempt ${attempt} failed:`, gate.failures.join(' | '));
    } catch (e) {
      console.error(`[spotlight] attempt ${attempt} error:`, e.message);
    }
  }

  return { stored: false, reason: 'quality-gate-exhausted' };
}
