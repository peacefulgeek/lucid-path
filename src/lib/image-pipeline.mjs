/**
 * image-pipeline.mjs
 * Bunny CDN Library Rotation - NO more image generation costs.
 *
 * The site has 40 pre-generated WebP images at /library/lib-01.webp through /library/lib-40.webp.
 * When an article is published, we randomly pick one, download it, and re-upload it
 * to /images/{article-slug}.webp so Google sees a unique, indexable URL per article.
 *
 * HARDCODED CREDENTIALS per scope. Do NOT put in env vars.
 */

const BUNNY_STORAGE_ZONE = 'lucid-path';
const BUNNY_API_KEY = 'e1425c2f-1fef-4562-b1621adad2ce-c84a-41d5';
const BUNNY_PULL_ZONE = 'https://lucid-path.b-cdn.net';
const BUNNY_HOSTNAME = 'ny.storage.bunnycdn.com';

/**
 * Assign a hero image to an article by copying a library image to a unique slug path.
 * @param {string} slug - The article slug
 * @returns {Promise<string>} - The public CDN URL for the article's hero image
 */
export async function assignHeroImage(slug) {
  const sourceFile = `lib-${String(Math.floor(Math.random() * 40) + 1).padStart(2, '0')}.webp`;
  const destFile = `${slug}.webp`;

  try {
    // Download from library
    const sourceUrl = `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
    const downloadRes = await fetch(sourceUrl);
    if (!downloadRes.ok) throw new Error(`Download failed: ${downloadRes.status}`);
    const imageBuffer = await downloadRes.arrayBuffer();

    // Re-upload to /images/{slug}.webp
    const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/images/${destFile}`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': 'image/webp' },
      body: imageBuffer,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    console.log(`[image] Assigned ${sourceFile} -> /images/${destFile}`);
    return `${BUNNY_PULL_ZONE}/images/${destFile}`;
  } catch (err) {
    // Fallback: link directly to the library image
    console.warn(`[image] Copy failed for ${slug}, using library fallback:`, err.message);
    return `${BUNNY_PULL_ZONE}/library/${sourceFile}`;
  }
}

/**
 * Upload raw buffer to Bunny CDN.
 * @param {string} remotePath - Path within the storage zone
 * @param {Buffer|ArrayBuffer} buffer - File data
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} - Public CDN URL
 */
export async function uploadToBunny(remotePath, buffer, contentType = 'image/webp') {
  const uploadUrl = `https://${BUNNY_HOSTNAME}/${BUNNY_STORAGE_ZONE}/${remotePath}`;
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'AccessKey': BUNNY_API_KEY, 'Content-Type': contentType },
    body: buffer,
  });
  if (!res.ok) throw new Error(`Bunny upload failed: ${res.status}`);
  return `${BUNNY_PULL_ZONE}/${remotePath}`;
}
