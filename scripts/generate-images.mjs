#!/usr/bin/env node
/**
 * generate-images.mjs
 * Generates hero images (1200x675) and OG images (1200x630) for all 300 articles
 * using FAL.ai API, compresses to WebP via sharp, uploads to Bunny CDN.
 * 
 * Usage: FAL_KEY=xxx node scripts/generate-images.mjs [--start N] [--end N] [--og-only]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to import sharp
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.error('sharp not available, will upload raw images');
}

// ─── CONFIG ───
const FAL_KEY = process.env.FAL_KEY;
const BUNNY_STORAGE_ZONE = "lucid-path";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "e1425c2f-1fef-4562-b1621adad2ce-c84a-41d5";
const BUNNY_CDN_BASE = "https://lucid-path.b-cdn.net";

const CONCURRENCY = 3; // Parallel image generations
const RETRY_MAX = 3;
const RETRY_DELAY = 5000;

// ─── LOAD ARTICLES ───
const articlesPath = path.join(__dirname, '..', 'client', 'src', 'data', 'articles.json');
const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

// Parse args
const args = process.argv.slice(2);
const startIdx = args.includes('--start') ? parseInt(args[args.indexOf('--start') + 1]) : 0;
const endIdx = args.includes('--end') ? parseInt(args[args.indexOf('--end') + 1]) : 300;
const ogOnly = args.includes('--og-only');
const heroOnly = args.includes('--hero-only');

console.log(`Processing articles ${startIdx} to ${endIdx}`);
if (ogOnly) console.log('OG images only');
if (heroOnly) console.log('Hero images only');

// ─── FAL.AI IMAGE GENERATION ───
async function generateImage(prompt, width, height) {
  const response = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: { width, height },
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`FAL.ai error ${response.status}: ${text}`);
  }
  
  const result = await response.json();
  
  // Check if we got a request_id (queued)
  if (result.request_id) {
    // Poll for result
    return await pollForResult(result.request_id);
  }
  
  if (result.images && result.images.length > 0) {
    return result.images[0].url;
  }
  
  throw new Error('No image in response: ' + JSON.stringify(result));
}

async function pollForResult(requestId) {
  const maxPolls = 60;
  for (let i = 0; i < maxPolls; i++) {
    await sleep(2000);
    
    const statusRes = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${requestId}/status`, {
      headers: { 'Authorization': `Key ${FAL_KEY}` },
    });
    
    const status = await statusRes.json();
    
    if (status.status === 'COMPLETED') {
      const resultRes = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${requestId}`, {
        headers: { 'Authorization': `Key ${FAL_KEY}` },
      });
      const result = await resultRes.json();
      if (result.images && result.images.length > 0) {
        return result.images[0].url;
      }
      throw new Error('No image in completed result');
    }
    
    if (status.status === 'FAILED') {
      throw new Error('FAL.ai generation failed: ' + JSON.stringify(status));
    }
  }
  throw new Error('FAL.ai polling timeout');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── DOWNLOAD AND COMPRESS ───
async function downloadAndCompress(url, width, height, quality = 82) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  
  const buffer = Buffer.from(await response.arrayBuffer());
  
  if (sharp) {
    const webpBuffer = await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();
    return webpBuffer;
  }
  
  return buffer;
}

// ─── UPLOAD TO BUNNY CDN ───
async function uploadToBunny(buffer, remotePath, contentType = 'image/webp') {
  const url = `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/${remotePath}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_STORAGE_PASSWORD,
      'Content-Type': contentType,
    },
    body: buffer,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Bunny upload failed: ${response.status} ${text}`);
  }
  
  return `${BUNNY_CDN_BASE}/${remotePath}`;
}

// ─── PROCESS SINGLE ARTICLE ───
async function processArticle(article, index) {
  const results = { heroUrl: article.heroImage, ogUrl: article.ogImage };
  
  // Generate hero image
  if (!heroOnly || !ogOnly) {
    if (!article.heroImage || heroOnly || (!ogOnly)) {
      for (let attempt = 0; attempt < RETRY_MAX; attempt++) {
        try {
          console.log(`  [${index + 1}/300] Hero: ${article.slug}`);
          const imageUrl = await generateImage(article.imageDescription, 1200, 675);
          const compressed = await downloadAndCompress(imageUrl, 1200, 675, 82);
          
          // Check size
          const sizeKB = compressed.length / 1024;
          if (sizeKB > 200) {
            // Re-compress at lower quality
            const recompressed = await sharp(compressed).webp({ quality: 70 }).toBuffer();
            results.heroUrl = await uploadToBunny(recompressed, `images/hero/${article.slug}.webp`);
          } else {
            results.heroUrl = await uploadToBunny(compressed, `images/hero/${article.slug}.webp`);
          }
          console.log(`    ✓ Hero uploaded (${sizeKB.toFixed(0)}KB)`);
          break;
        } catch (err) {
          console.error(`    ✗ Hero attempt ${attempt + 1}: ${err.message}`);
          if (attempt < RETRY_MAX - 1) await sleep(RETRY_DELAY);
        }
      }
    }
  }
  
  // Generate OG image
  if (!heroOnly) {
    if (!article.ogImage || ogOnly || (!heroOnly)) {
      for (let attempt = 0; attempt < RETRY_MAX; attempt++) {
        try {
          console.log(`  [${index + 1}/300] OG: ${article.slug}`);
          const imageUrl = await generateImage(article.ogImageDescription, 1200, 630);
          const compressed = await downloadAndCompress(imageUrl, 1200, 630, 85);
          results.ogUrl = await uploadToBunny(compressed, `images/og/${article.slug}.webp`);
          console.log(`    ✓ OG uploaded`);
          break;
        } catch (err) {
          console.error(`    ✗ OG attempt ${attempt + 1}: ${err.message}`);
          if (attempt < RETRY_MAX - 1) await sleep(RETRY_DELAY);
        }
      }
    }
  }
  
  return results;
}

// ─── BATCH PROCESSOR ───
async function processBatch(articles, startIndex) {
  const results = [];
  
  for (let i = 0; i < articles.length; i += CONCURRENCY) {
    const batch = articles.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map((article, j) => processArticle(article, startIndex + i + j))
    );
    results.push(...batchResults);
    
    // Save progress every 10 articles
    if ((i + CONCURRENCY) % 10 === 0 || i + CONCURRENCY >= articles.length) {
      saveProgress(results, startIndex);
    }
  }
  
  return results;
}

function saveProgress(results, startIndex) {
  // Update articles.json with image URLs
  for (let i = 0; i < results.length; i++) {
    const articleIdx = startIndex + i;
    if (results[i].heroUrl) {
      articlesData.articles[articleIdx].heroImage = results[i].heroUrl;
    }
    if (results[i].ogUrl) {
      articlesData.articles[articleIdx].ogImage = results[i].ogUrl;
    }
  }
  
  fs.writeFileSync(articlesPath, JSON.stringify(articlesData, null, 2));
  console.log(`  Progress saved: ${results.length} articles updated`);
}

// ─── MAIN ───
async function main() {
  if (!FAL_KEY) {
    console.error('FAL_KEY environment variable required');
    process.exit(1);
  }
  
  const articles = articlesData.articles.slice(startIdx, endIdx);
  console.log(`\nGenerating images for ${articles.length} articles...`);
  console.log(`FAL.ai key: ${FAL_KEY.substring(0, 8)}...`);
  console.log(`Bunny CDN: ${BUNNY_CDN_BASE}`);
  console.log(`Concurrency: ${CONCURRENCY}\n`);
  
  const startTime = Date.now();
  await processBatch(articles, startIdx);
  
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\nDone! ${articles.length} articles processed in ${elapsed} minutes`);
  
  // Count successful uploads
  let heroCount = 0, ogCount = 0;
  for (const article of articlesData.articles) {
    if (article.heroImage) heroCount++;
    if (article.ogImage) ogCount++;
  }
  console.log(`Heroes: ${heroCount}/300, OG: ${ogCount}/300`);
}

main().catch(console.error);
