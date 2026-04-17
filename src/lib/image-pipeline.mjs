/**
 * image-pipeline.mjs
 * FAL → WebP → Bunny CDN image pipeline for article hero images.
 * Generates dreamy, atmospheric images for lucid dreaming articles.
 *
 * Environment variables:
 *   FAL_KEY — FAL.ai API key
 *   BUNNY_API_KEY — Bunny CDN storage API key
 *   BUNNY_STORAGE_ZONE — Bunny storage zone name (default: lucid-path)
 *   BUNNY_CDN_URL — Bunny CDN pull zone URL (default: https://lucid-path.b-cdn.net)
 */

const FAL_KEY = process.env.FAL_KEY;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || 'lucid-path';
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL || 'https://lucid-path.b-cdn.net';

/**
 * Design tokens for image generation prompts.
 * Ensures visual consistency across all generated images.
 */
const DESIGN_TOKENS = {
  palette: 'deep indigo, midnight purple, soft aurora teal, warm amber glow, cosmic blue',
  mood: 'dreamy, ethereal, mystical, contemplative, serene',
  style: 'digital painting, atmospheric, soft lighting, subtle glow effects, cinematic composition',
  avoid: 'text, watermark, logo, signature, border, frame, cartoon, anime, photorealistic faces',
};

/**
 * Category-specific image prompt templates.
 */
const CATEGORY_PROMPTS = {
  'the-basics': 'A serene dreamscape with soft glowing elements, beginner-friendly and inviting atmosphere, {palette}, {mood}',
  'the-techniques': 'An abstract visualization of consciousness techniques, geometric patterns merging with organic forms, {palette}, {mood}',
  'the-science': 'A scientific visualization of brain activity during sleep, neural pathways glowing with bioluminescence, {palette}, {mood}',
  'the-practice': 'A meditative scene with a figure in contemplation, surrounded by dream-like elements, {palette}, {mood}',
  'the-advanced': 'An advanced astral landscape with complex dream architecture, multiple layers of reality, {palette}, {mood}',
};

/**
 * Generate an image prompt from article metadata.
 */
export function buildImagePrompt(title, category, description) {
  const base = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['the-basics'];
  const prompt = base
    .replace('{palette}', DESIGN_TOKENS.palette)
    .replace('{mood}', DESIGN_TOKENS.mood);

  return `${prompt}. Inspired by: ${title}. ${DESIGN_TOKENS.style}. Negative: ${DESIGN_TOKENS.avoid}`;
}

/**
 * Generate image via FAL.ai
 */
export async function generateImageFal(prompt) {
  if (!FAL_KEY) throw new Error('FAL_KEY not set');

  const res = await fetch('https://queue.fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Key ${FAL_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      image_size: { width: 1200, height: 630 }, // OG image dimensions
      num_inference_steps: 28,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FAL API error ${res.status}: ${err}`);
  }

  const data = await res.json();

  // FAL queue returns a request_id for async processing
  if (data.request_id) {
    // Poll for result
    let result;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const statusRes = await fetch(`https://queue.fal.run/fal-ai/flux/dev/requests/${data.request_id}/status`, {
        headers: { 'Authorization': `Key ${FAL_KEY}` },
      });
      const status = await statusRes.json();
      if (status.status === 'COMPLETED') {
        const resultRes = await fetch(`https://queue.fal.run/fal-ai/flux/dev/requests/${data.request_id}`, {
          headers: { 'Authorization': `Key ${FAL_KEY}` },
        });
        result = await resultRes.json();
        break;
      }
      if (status.status === 'FAILED') throw new Error('FAL generation failed');
    }
    if (!result) throw new Error('FAL generation timed out');
    return result.images[0].url;
  }

  return data.images[0].url;
}

/**
 * Convert image to WebP format using sharp (if available) or pass through.
 */
export async function convertToWebP(imageBuffer) {
  try {
    const sharp = (await import('sharp')).default;
    return await sharp(imageBuffer)
      .webp({ quality: 82 })
      .resize(1200, 630, { fit: 'cover' })
      .toBuffer();
  } catch (e) {
    console.warn('[image-pipeline] sharp not available, using original format');
    return imageBuffer;
  }
}

/**
 * Upload image to Bunny CDN storage.
 */
export async function uploadToBunny(buffer, remotePath, contentType = 'image/webp') {
  if (!BUNNY_API_KEY) throw new Error('BUNNY_API_KEY not set');

  const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${remotePath}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': contentType,
    },
    body: buffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Bunny upload error ${res.status}: ${err}`);
  }

  return `${BUNNY_CDN_URL}/${remotePath}`;
}

/**
 * Full pipeline: generate → convert → upload → return CDN URL.
 */
export async function generateArticleImage(slug, title, category, description) {
  const prompt = buildImagePrompt(title, category, description);

  // Generate via FAL
  const falUrl = await generateImageFal(prompt);

  // Download the generated image
  const imgRes = await fetch(falUrl);
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer());

  // Convert to WebP
  const webpBuffer = await convertToWebP(imgBuffer);

  // Upload to Bunny CDN
  const remotePath = `images/hero/${slug}.webp`;
  const cdnUrl = await uploadToBunny(webpBuffer, remotePath);

  return {
    heroImage: cdnUrl,
    ogImage: cdnUrl,
    prompt,
  };
}

/**
 * Batch generate images for articles missing them.
 */
export async function generateMissingImages(articles) {
  const missing = articles.filter(a => !a.heroImage || a.heroImage.includes('placeholder'));
  console.log(`[image-pipeline] ${missing.length} articles need images`);

  const results = [];
  for (const art of missing) {
    try {
      const result = await generateArticleImage(
        art.slug,
        art.title,
        art.category,
        art.imageDescription || art.metaDescription || ''
      );
      results.push({ slug: art.slug, ...result });
      console.log(`[image-pipeline] Generated image for ${art.slug}`);
      // Rate limit: 1 image every 5 seconds
      await new Promise(r => setTimeout(r, 5000));
    } catch (e) {
      console.error(`[image-pipeline] Failed for ${art.slug}:`, e.message);
      results.push({ slug: art.slug, error: e.message });
    }
  }

  return results;
}
