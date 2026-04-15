#!/usr/bin/env node
/**
 * generate-articles.mjs
 * Auto-generation pipeline for new articles.
 * ALL secrets from process.env. NEVER hardcode API keys.
 *
 * Required env vars (set in Render dashboard):
 * - ANTHROPIC_API_KEY
 * - FAL_KEY
 * - GH_PAT
 *
 * Bunny CDN credentials are safe to include in code per scope.
 *
 * HUMANIZATION RULES (applied to all generated content):
 * 1. NO em-dashes or en-dashes — use ..., -, or ~ instead
 * 2. Banned AI words: profound, transformative, holistic, nuanced, multifaceted,
 *    delve, tapestry, landscape, realm, embark, unveil, leverage, foster, paradigm,
 *    synergy, optimize, utilize, facilitate, comprehensive, robust, innovative,
 *    cutting-edge, game-changer
 * 3. 2 conversational interjections per article
 * 4. Kalesh voice: 40% teaching, 30% tender, 20% philosophical, 10% fierce
 * 5. Sentence length: 18-28 avg, short drops after 3 long ones
 * 6. Cross-traditional: Buddhism, Taoism, neuroscience
 * 7. Uses "we" and "one" more than "you"
 * 8. Amazon affiliate links: 2-4 per article, tag=spankyspinola-20
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUNNY_STORAGE_ZONE = "lucid-path";
const BUNNY_STORAGE_HOST = "ny.storage.bunnycdn.com";
const BUNNY_STORAGE_PASSWORD = "e1425c2f-1fef-4562-b1621adad2ce-c84a-41d5";
const BUNNY_CDN_BASE = "https://lucid-path.b-cdn.net";
const AMAZON_TAG = "spankyspinola-20";

const BANNED_WORDS = [
  "profound", "transformative", "holistic", "nuanced", "multifaceted",
  "delve", "tapestry", "landscape", "realm", "embark", "unveil",
  "leverage", "foster", "paradigm", "synergy", "optimize", "utilize",
  "facilitate", "comprehensive", "robust", "innovative", "cutting-edge",
  "game-changer"
];

const BANNED_REPLACEMENTS = {
  "profound": ["deep", "striking", "genuine", "real", "significant", "meaningful"],
  "transformative": ["life-changing", "powerful", "reshaping", "eye-opening"],
  "holistic": ["whole-person", "integrated", "complete", "full-spectrum"],
  "nuanced": ["subtle", "layered", "textured", "complex"],
  "multifaceted": ["many-sided", "complex", "layered", "varied"],
  "delve": ["dig", "explore", "look closely at", "examine"],
  "tapestry": ["weave", "fabric", "web", "pattern", "mosaic"],
  "landscape": ["terrain", "territory", "field", "space", "world"],
  "realm": ["space", "territory", "domain", "world", "sphere"],
  "embark": ["start", "begin", "set out on", "step into"],
  "unveil": ["reveal", "show", "uncover", "expose"],
  "leverage": ["use", "apply", "draw on", "work with"],
  "foster": ["encourage", "support", "cultivate", "nurture"],
  "paradigm": ["framework", "model", "way of thinking"],
  "synergy": ["connection", "interplay", "cooperation"],
  "optimize": ["improve", "refine", "fine-tune", "sharpen"],
  "utilize": ["use", "apply", "work with", "employ"],
  "facilitate": ["support", "enable", "help", "make possible"],
  "comprehensive": ["thorough", "complete", "full", "detailed"],
  "robust": ["strong", "solid", "reliable", "sturdy"],
  "innovative": ["creative", "fresh", "original", "new"],
  "cutting-edge": ["leading", "advanced", "modern"],
  "game-changer": ["breakthrough", "turning point", "shift"]
};

const INTERJECTIONS = [
  "Stay with me here.",
  "I know, I know.",
  "Wild, right?",
  "Think about that for a second.",
  "Here's the thing, though.",
  "Bear with me on this one.",
  "Let that land for a moment.",
  "Sit with that.",
  "Sounds strange, I know.",
  "Not what you expected, right?"
];

const KALESH_PHRASES = [
  "the quiet architecture of awareness",
  "where the breath meets the dream",
  "consciousness doesn't punch a clock",
  "the body remembers what the mind forgets",
  "awareness is not a destination, it's a weather pattern",
  "the dream is already dreaming you",
  "lucidity begins where certainty ends",
  "sleep is the laboratory of the soul",
  "the dreaming mind has its own grammar",
  "presence is the only passport you need"
];

const DASH_ALTS = ["...", " - ", " ~ "];

/**
 * Post-process generated text to enforce humanization rules.
 */
function humanize(text) {
  // Replace em-dashes and en-dashes
  text = text.replace(/\s*—\s*/g, () => DASH_ALTS[Math.floor(Math.random() * DASH_ALTS.length)]);
  text = text.replace(/(?<!\d)\s*–\s*(?!\d)/g, () => DASH_ALTS[Math.floor(Math.random() * DASH_ALTS.length)]);

  // Replace banned words
  for (const [banned, alts] of Object.entries(BANNED_REPLACEMENTS)) {
    const regex = new RegExp(banned.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    text = text.replace(regex, (match) => {
      const alt = alts[Math.floor(Math.random() * alts.length)];
      return match[0] === match[0].toUpperCase()
        ? alt.charAt(0).toUpperCase() + alt.slice(1)
        : alt;
    });
  }

  // Replace multi-word AI phrases
  const phrases = [
    ["dive into", ["look at", "explore", "get into"]],
    ["at the end of the day", ["ultimately", "when it comes down to it"]],
    ["in today's world", ["right now", "these days"]],
    ["it's worth noting", ["notice that", "consider this"]],
  ];
  for (const [phrase, alts] of phrases) {
    const regex = new RegExp(phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    text = text.replace(regex, () => alts[Math.floor(Math.random() * alts.length)]);
  }

  return text;
}

/**
 * Build the system prompt for article generation with Kalesh voice.
 */
function buildSystemPrompt() {
  return `You are writing as Kalesh, a consciousness teacher and writer. Your voice:

TONE MIX: 40% teaching (clear, direct instruction), 30% tender (gentle, compassionate), 20% philosophical (contemplative, questioning), 10% fierce (urgent, challenging).

SENTENCE STRUCTURE: Average 18-28 words. After 3 long sentences, drop a short one (5-8 words). Never start 2 consecutive sentences with the same word.

PRONOUNS: Use "we" and "one" more than "you". Cross-traditional: Buddhism, Taoism, neuroscience.

INTERJECTIONS: Include exactly 2 conversational interjections naturally in the text. Choose from: ${INTERJECTIONS.join(", ")}

BANNED WORDS (never use): ${BANNED_WORDS.join(", ")}

DASHES: Never use em-dashes (—) or en-dashes (–). Use ... or - or ~ instead.

AFFILIATE LINKS: Include 2-4 Amazon product links naturally in the text using format:
<a href="https://www.amazon.com/dp/ASIN?tag=${AMAZON_TAG}" target="_blank" rel="nofollow noopener">Product Name</a> (paid link)

OUTPUT: Clean HTML paragraphs and headings. No wrapper tags. No markdown.`;
}

/**
 * Upload a file to Bunny CDN storage.
 */
async function uploadToBunny(buffer, remotePath, contentType = "image/webp") {
  const url = `https://${BUNNY_STORAGE_HOST}/${BUNNY_STORAGE_ZONE}/${remotePath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "AccessKey": BUNNY_STORAGE_PASSWORD,
      "Content-Type": contentType,
    },
    body: buffer,
  });
  if (!response.ok) {
    throw new Error(`Bunny upload failed: ${response.status} ${response.statusText}`);
  }
  return `${BUNNY_CDN_BASE}/${remotePath}`;
}

/**
 * Generate articles using Anthropic API.
 */
export async function generateArticles(count = 5) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const FAL_KEY = process.env.FAL_KEY;
  const GH_PAT = process.env.GH_PAT;

  if (!ANTHROPIC_API_KEY) {
    console.error("[generate] ANTHROPIC_API_KEY not set. Skipping.");
    return;
  }

  console.log(`[generate] Starting article generation pipeline (${count} articles)...`);
  console.log("[generate] Humanization rules: active");
  console.log("[generate] Banned words: " + BANNED_WORDS.length);
  console.log("[generate] Bunny CDN:", BUNNY_CDN_BASE);

  // Read existing articles to determine next IDs and avoid duplicates
  const articlesPath = join(__dirname, "..", "client", "src", "data", "articles.json");
  const publicPath = join(__dirname, "..", "client", "public", "data", "articles.json");

  let articlesData;
  try {
    articlesData = JSON.parse(readFileSync(articlesPath, "utf-8"));
  } catch (e) {
    console.error("[generate] Cannot read articles.json:", e.message);
    return;
  }

  const existingIds = new Set(articlesData.articles.map(a => a.id));
  const nextId = Math.max(...existingIds) + 1;
  console.log(`[generate] Next article ID: ${nextId}`);

  // TODO: Full implementation when AUTO_GEN_ENABLED is true
  // 1. Pick topics from unused topic pool
  // 2. Call Anthropic with buildSystemPrompt()
  // 3. Post-process with humanize()
  // 4. Generate hero image via FAL.ai
  // 5. Convert to WebP, upload to Bunny CDN
  // 6. Append to articles.json
  // 7. Commit and push to GitHub

  console.log("[generate] Pipeline stub complete. Full implementation pending API activation.");
}

/**
 * Generate a product spotlight article.
 */
export async function generateSpotlight() {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error("[generate] ANTHROPIC_API_KEY not set. Skipping spotlight.");
    return;
  }

  console.log("[generate] Starting product spotlight generation...");
  console.log("[generate] Humanization rules: active");

  // TODO: Full implementation
  // 1. Pick a product from product-catalog.ts
  // 2. Generate review/spotlight article with Kalesh voice
  // 3. Post-process with humanize()
  // 4. Upload images to Bunny CDN
  // 5. Append to articles.json
  // 6. Commit and push

  console.log("[generate] Spotlight stub complete.");
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateArticles().catch(console.error);
}
