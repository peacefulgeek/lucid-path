/**
 * generate-article.mjs
 * Article generation cron job with 3-attempt quality gate.
 * Uses Anthropic for generation, quality gate for validation,
 * and amazon-verify for ASIN checking.
 */

import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import { verifyAsin, extractAsinsFromText, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
import fs from 'fs';
import path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

/**
 * Load the product catalog from the TypeScript source.
 * In production, this reads from the built catalog.
 */
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
    console.error('[generate] Failed to load product catalog:', e);
    return [];
  }
}

/**
 * Call Anthropic to generate an article.
 * Uses the HARD RULES prompt to enforce quality.
 */
async function generateFromAnthropic(topic, category, catalog) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set');
  }

  const catalogSnippet = catalog
    .filter(p => p.category === category || Math.random() < 0.3)
    .slice(0, 15)
    .map(p => `- ${p.name} (ASIN: ${p.asin})`)
    .join('\n');

  const systemPrompt = `You are a lucid dreaming expert writing for The Lucid Path blog. Write in a warm, conversational, first-person or direct-address style. You're writing for people who are genuinely curious about lucid dreaming.

Available Amazon products to link (use 3-4 naturally in prose, each followed by "(paid link)"):
${catalogSnippet}

Amazon link format: https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}

${GENERATION_HARD_RULES}`;

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
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: `Write a blog article about: ${topic}\n\nCategory: ${category}\n\nReturn the article as HTML (no <html>/<body> tags, just the article content with <h2>, <h3>, <p>, <a> tags). Include a compelling title in an <h1> tag at the start.`
      }]
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const body = data.content[0]?.text || '';

  // Extract title from h1
  const titleMatch = body.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : topic;

  return {
    title,
    body,
    category,
    topic,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  };
}

/**
 * Swap dead ASINs with valid ones from the catalog.
 */
async function swapDeadAsins(body, deadAsins, category, catalog) {
  let result = body;
  const existingAsins = new Set(extractAsinsFromText(body));

  for (const deadAsin of deadAsins) {
    // Find a replacement from the same category
    const replacement = catalog.find(p =>
      p.category === category &&
      !existingAsins.has(p.asin) &&
      !deadAsins.includes(p.asin)
    ) || catalog.find(p =>
      !existingAsins.has(p.asin) &&
      !deadAsins.includes(p.asin)
    );

    if (replacement) {
      const deadUrl = new RegExp(`https://www\\.amazon\\.com/dp/${deadAsin}[^"]*`, 'g');
      result = result.replace(deadUrl, buildAmazonUrl(replacement.asin));
      existingAsins.add(replacement.asin);
    }
  }

  return result;
}

/**
 * Store article in articles.json
 */
async function storeArticle(article) {
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  let articles = {};
  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  } catch (e) {
    console.warn('[generate] Could not read articles.json, starting fresh');
  }

  articles[article.slug] = {
    title: article.title,
    slug: article.slug,
    category: article.category,
    body: article.body,
    publishedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    wordCount: article.wordCount || 0,
    amazonLinks: article.amazonLinks || 0
  };

  fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2));
}

/**
 * Main generation function with 3-attempt quality gate.
 */
export async function generateNewArticle() {
  const catalog = loadCatalog();
  if (catalog.length === 0) {
    console.error('[generate] No products in catalog, aborting');
    return { stored: false, reason: 'empty-catalog' };
  }

  // Pick a random topic (in production, this would come from a topic queue)
  const topics = [
    'Reality testing techniques for beginners',
    'The science of REM sleep and lucid dreaming',
    'How to use WBTB technique effectively',
    'Dream journaling best practices',
    'MILD technique step by step guide',
    'Supplements that support lucid dreaming',
    'Sleep hygiene for better dream recall',
    'Advanced lucid dreaming stabilization',
    'Meditation practices for lucid dreamers',
    'Common lucid dreaming mistakes to avoid'
  ];
  const categories = ['the-basics', 'the-science', 'the-techniques', 'the-practice', 'the-advanced'];
  const topicIdx = Math.floor(Math.random() * topics.length);
  const topic = topics[topicIdx];
  const category = categories[topicIdx % categories.length];

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const article = await generateFromAnthropic(topic, category, catalog);

      // Verify every ASIN before gate check
      const asins = extractAsinsFromText(article.body);
      const checks = await Promise.all(asins.map(a => verifyAsin(a)));
      const dead = checks.filter(r => !r.valid);

      if (dead.length > 0) {
        article.body = await swapDeadAsins(article.body, dead.map(d => d.asin), category, catalog);
      }

      const gate = runQualityGate(article.body);
      if (gate.passed) {
        article.wordCount = gate.wordCount;
        article.amazonLinks = gate.amazonLinks;
        await storeArticle(article);
        console.log(`[generate] stored ${article.slug} (${gate.wordCount} words, ${gate.amazonLinks} links)`);
        return { stored: true, attempts: attempt };
      }

      console.warn(`[generate] attempt ${attempt} failed:`, gate.failures.join(' | '));
    } catch (e) {
      console.error(`[generate] attempt ${attempt} error:`, e.message);
    }
  }

  console.error('[generate] abandoned after 3 attempts, NOT storing broken article');
  return { stored: false, reason: 'quality-gate-exhausted' };
}
