/**
 * generate-article.mjs
 * Article Publisher cron — queue-based publishing with DeepSeek V4-Pro.
 *
 * Logic:
 * 1. Check queue. If queued articles exist, publish one (assign hero image, set status='published').
 * 2. If queue is empty, generate a new article via DeepSeek, pass through quality gate, publish directly.
 *
 * Schedule:
 * - Phase 1 (published < 60): 5x/day (07:00, 10:00, 13:00, 16:00, 19:00 UTC) every day
 * - Phase 2 (published >= 60): 1x/weekday (08:00 UTC) Mon-Fri only
 */

import OpenAI from 'openai';
import { runQualityGate, GENERATION_HARD_RULES } from '../../src/lib/article-quality-gate.mjs';
import { verifyAsin, extractAsinsFromText, buildAmazonUrl } from '../../src/lib/amazon-verify.mjs';
import { assignHeroImage } from '../../src/lib/image-pipeline.mjs';
import fs from 'fs';
import path from 'path';

const AMAZON_TAG = process.env.AMAZON_TAG || 'spankyspinola-20';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com'
});

const MODEL = process.env.OPENAI_MODEL || 'deepseek-v4-pro';

// ─── ASIN POOL ───
const VERIFIED_ASINS = [
  '034537410X', 'B07RWRJ4XW', 'B07PCVWM6N', 'B0C1Z3SJ36', 'B09NXLM8ZD',
  'B00E9M4XEE', 'B000GG0BNE', 'B0DJHK7DPQ', 'B0BF2KBHBP', 'B0BSHRYXFG',
  'B0D2M1HFQZ', '1577319443', '0062515675', '1250113326', '0553370286',
  '1855384566', '0345413350', '1683643313', '1683491564', '0062513710',
  '1577314808', '0143111345', '0140195963', '1591799600', 'B07BFQCF9D',
  'B0CGKFNQMS', 'B0C5KGKX2L', 'B09JNR5HBQ', 'B0C7CTYLQ2', 'B0BX7DVMHH',
  'B0B14QQV6R', 'B08DG4GNKP', 'B09683N7BX', 'B0BSHRYXFG', 'B08LQNL42J',
  'B0CGKFNQMS', 'B0C1Z3SJ36', 'B07RWRJ4XW', 'B00E9M4XEE', 'B0D2M1HFQZ'
];

function getRandomAsins(count = 4) {
  const shuffled = [...VERIFIED_ASINS].sort(() => Math.random() - 0.5);
  return [...new Set(shuffled)].slice(0, count);
}

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

function loadArticles() {
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  try {
    return JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
  } catch {
    return { articles: [], stats: {} };
  }
}

function saveArticles(data) {
  const articlesPath = path.resolve(import.meta.dirname, '../../client/src/data/articles.json');
  fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
}

function getPublishedCount(data) {
  return (data.articles || []).filter(a => a.status === 'published' || !a.status).length;
}

function getQueuedArticles(data) {
  return (data.articles || []).filter(a => a.status === 'queued');
}

/**
 * Publish a queued article: assign hero image, set status='published', set published_at.
 */
async function publishFromQueue(data) {
  const queued = getQueuedArticles(data);
  if (queued.length === 0) return null;

  // Pick the oldest queued article
  const article = queued.sort((a, b) => new Date(a.queued_at || 0) - new Date(b.queued_at || 0))[0];

  // Assign hero image via Bunny CDN library rotation
  const heroImage = await assignHeroImage(article.slug);

  // Update the article
  const idx = data.articles.findIndex(a => a.slug === article.slug);
  if (idx !== -1) {
    data.articles[idx].status = 'published';
    data.articles[idx].published_at = new Date().toISOString();
    data.articles[idx].heroImage = heroImage;
    data.articles[idx].ogImage = heroImage;
    if (!data.articles[idx].dateISO) {
      data.articles[idx].dateISO = new Date().toISOString().split('T')[0];
    }
  }

  saveArticles(data);
  console.log(`[generate] Published from queue: ${article.slug} (${queued.length - 1} remaining)`);
  return article;
}

/**
 * Generate a new article via DeepSeek V4-Pro with 4-attempt quality gate.
 */
async function generateNewArticle(topic, category, catalog) {
  const catalogSnippet = catalog
    .filter(p => p.category === category || Math.random() < 0.3)
    .slice(0, 15)
    .map(p => `- ${p.name} (ASIN: ${p.asin})`)
    .join('\n');

  const systemPrompt = `You are a lucid dreaming expert writing for The Lucid Path blog. Write in a warm, conversational, direct-address style. You're writing for people who are genuinely curious about lucid dreaming.

Available Amazon products to link (use exactly 3 or 4 naturally in prose, each followed by "(paid link)"):
${catalogSnippet}

Amazon link format: <a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>

${GENERATION_HARD_RULES}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Write a blog article about: ${topic}\n\nCategory: ${category}\n\nReturn the article as HTML (no <html>/<body> tags, just the article content with <h2>, <h3>, <p>, <a> tags). Include a compelling title in an <h1> tag at the start.`
      }
    ],
    temperature: 0.72
  });

  const body = response.choices[0]?.message?.content || '';
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
 * Main entry: publish from queue or generate new.
 */
export async function generateAndPublish() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('[generate] OPENAI_API_KEY not set');
    return { stored: false, reason: 'no-api-key' };
  }

  const data = loadArticles();
  const catalog = loadCatalog();

  // Try to publish from queue first
  const queued = getQueuedArticles(data);
  if (queued.length > 0) {
    const published = await publishFromQueue(data);
    if (published) return { stored: true, source: 'queue', slug: published.slug };
  }

  // Queue empty — generate a new article
  if (catalog.length === 0) {
    console.error('[generate] No products in catalog, aborting');
    return { stored: false, reason: 'empty-catalog' };
  }

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

  // 4-attempt quality gate
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const article = await generateNewArticle(topic, category, catalog);

      // Verify ASINs
      const asins = extractAsinsFromText(article.body);
      const checks = await Promise.all(asins.map(a => verifyAsin(a)));
      const dead = checks.filter(r => !r.valid);
      if (dead.length > 0) {
        for (const d of dead) {
          const replacement = catalog.find(p => !asins.includes(p.asin));
          if (replacement) {
            article.body = article.body.replace(
              new RegExp(`https://www\\.amazon\\.com/dp/${d.asin}[^"]*`, 'g'),
              buildAmazonUrl(replacement.asin)
            );
          }
        }
      }

      const gate = runQualityGate(article.body);
      if (gate.passed) {
        // Assign hero image
        const heroImage = await assignHeroImage(article.slug);

        // Store as published
        data.articles.push({
          ...article,
          body: gate.body, // em-dash cleaned
          status: 'published',
          published_at: new Date().toISOString(),
          queued_at: new Date().toISOString(),
          dateISO: new Date().toISOString().split('T')[0],
          heroImage,
          ogImage: heroImage,
          wordCount: gate.wordCount,
          amazonLinks: gate.amazonLinks
        });
        saveArticles(data);
        console.log(`[generate] Published new: ${article.slug} (${gate.wordCount} words, ${gate.amazonLinks} links)`);
        return { stored: true, source: 'generated', slug: article.slug, attempts: attempt };
      }

      console.warn(`[generate] attempt ${attempt} failed:`, gate.failures.join(' | '));
    } catch (e) {
      console.error(`[generate] attempt ${attempt} error:`, e.message);
    }
  }

  console.error('[generate] Abandoned after 4 attempts, NOT storing broken article');
  return { stored: false, reason: 'quality-gate-exhausted' };
}
