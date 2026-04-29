/**
 * article-quality-gate.mjs
 * The Paul Voice Gate. Every article must pass ALL checks before storage.
 * Non-negotiable. If it fails, regenerate (up to 4 attempts). Do not store failed articles.
 */

import { countAmazonLinks, extractAsinsFromText } from './amazon-verify.mjs';

// ─── BANNED WORDS (regex match, case-insensitive) ───
// If ANY appear → FAIL AND REGENERATE
const AI_FLAGGED_WORDS = [
  'utilize', 'delve', 'tapestry', 'landscape', 'paradigm', 'synergy',
  'leverage', 'unlock', 'empower', 'pivotal', 'embark', 'underscore',
  'paramount', 'seamlessly', 'robust', 'beacon', 'foster', 'elevate',
  'curate', 'curated', 'bespoke', 'resonate', 'harness', 'intricate',
  'plethora', 'myriad', 'groundbreaking', 'innovative', 'cutting-edge',
  'state-of-the-art', 'game-changer', 'ever-evolving', 'rapidly-evolving',
  'stakeholders', 'navigate', 'ecosystem', 'framework', 'comprehensive',
  'transformative', 'holistic', 'nuanced', 'multifaceted', 'profound',
  'furthermore'
];

// ─── BANNED PHRASES (string match, case-insensitive) ───
// If ANY appear → FAIL AND REGENERATE
const AI_FLAGGED_PHRASES = [
  "it's important to note that",
  "it's worth noting that",
  "in conclusion",
  "in summary",
  "a holistic approach",
  "in the realm of",
  "dive deep into",
  "at the end of the day",
  "in today's fast-paced world",
  "plays a crucial role"
];

export function countWords(text) {
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return stripped ? stripped.split(/\s+/).length : 0;
}

/**
 * Auto-replace em-dashes and en-dashes with " - " (hyphen with spaces).
 * Returns the cleaned text.
 */
export function replaceEmDashes(text) {
  return text.replace(/[\u2014\u2013]/g, ' - ');
}

/**
 * Check if any em-dashes or en-dashes survived after replacement.
 */
export function hasEmDash(text) {
  return /[\u2014\u2013]/.test(text);
}

export function findFlaggedWords(text) {
  const stripped = text.replace(/<[^>]+>/g, ' ').toLowerCase();
  const found = [];
  for (const w of AI_FLAGGED_WORDS) {
    const escaped = w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(stripped)) {
      found.push(w);
    }
  }
  return found;
}

export function findFlaggedPhrases(text) {
  const stripped = text.replace(/<[^>]+>/g, ' ').toLowerCase().replace(/\s+/g, ' ');
  return AI_FLAGGED_PHRASES.filter(p => stripped.includes(p.toLowerCase()));
}

/**
 * Check for dialogue markers per spec:
 * 2-3 conversational dialogue markers: "Right?!", "Know what I mean?",
 * "Does that land?", "How does that make you feel?"
 */
export function countDialogueMarkers(text) {
  const stripped = text.replace(/<[^>]+>/g, ' ');
  const markers = [
    /right\?!?/i, /know what i mean\??/i, /does that land\??/i,
    /how does that make you feel\??/i, /here's the thing/i,
    /honestly[,.]?\s/i, /look[,.]\s/i, /truth is/i,
    /think about it/i, /that said/i, /but here's/i,
    /you know what/i, /get this/i, /wild, right\??/i,
    /make sense\??/i, /sound familiar\??/i
  ];
  return markers.filter(r => r.test(stripped)).length;
}

export function runQualityGate(body) {
  const failures = [];

  // Step 0: Auto-replace em-dashes before any checks
  body = replaceEmDashes(body);

  // 1. Word count: hard floor 1200, hard ceiling 2500
  const words = countWords(body);
  if (words < 1200) failures.push(`words-too-low:${words}`);
  if (words > 2500) failures.push(`words-too-high:${words}`);

  // 2. Amazon links: exactly 3 or 4
  const links = countAmazonLinks(body);
  if (links < 3) failures.push(`amazon-links-too-few:${links}`);
  if (links > 4) failures.push(`amazon-links-too-many:${links}`);

  // 3. Em-dashes: zero tolerance (after auto-replace, if any survive, fail)
  if (hasEmDash(body)) failures.push('contains-em-dash');

  // 4. Banned words
  const bw = findFlaggedWords(body);
  if (bw.length > 0) failures.push(`banned-words:${bw.join(',')}`);

  // 5. Banned phrases
  const bp = findFlaggedPhrases(body);
  if (bp.length > 0) failures.push(`banned-phrases:${bp.join('|')}`);

  // 6. Voice: contractions
  const stripped = body.replace(/<[^>]+>/g, ' ').toLowerCase();
  const contractions = (stripped.match(/\b\w+'(s|re|ve|d|ll|m|t)\b/g) || []).length;
  if (contractions < 5) failures.push(`contractions-too-few:${contractions}`);

  // 7. Voice: direct address ("you")
  const youCount = (stripped.match(/\byou('re|r)?\b/g) || []).length;
  if (youCount < 5) failures.push(`direct-address-too-few:${youCount}`);

  // 8. Dialogue markers: need 2-3
  const markers = countDialogueMarkers(body);
  if (markers < 2) failures.push(`dialogue-markers-too-few:${markers}`);

  return {
    passed: failures.length === 0,
    failures,
    wordCount: words,
    amazonLinks: links,
    asins: extractAsinsFromText(body),
    body // return the em-dash-cleaned body
  };
}

/**
 * HARD RULES prompt for DeepSeek V4-Pro generation.
 */
export const GENERATION_HARD_RULES = `
HARD RULES for this article (violating ANY of these means the article is rejected):
- 1,200 to 2,500 words (strict).
- Zero em-dashes or en-dashes. Use commas, periods, colons, or " - " (hyphen with spaces) instead.
- NEVER use these words: utilize, delve, tapestry, landscape, paradigm, synergy, leverage, unlock, empower, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, groundbreaking, innovative, cutting-edge, state-of-the-art, game-changer, ever-evolving, rapidly-evolving, stakeholders, navigate, ecosystem, framework, comprehensive, transformative, holistic, nuanced, multifaceted, profound, furthermore.
- NEVER use these phrases: "it's important to note that", "it's worth noting that", "in conclusion", "in summary", "a holistic approach", "in the realm of", "dive deep into", "at the end of the day", "in today's fast-paced world", "plays a crucial role".
- Direct address ("you") throughout. Contractions everywhere (don't, can't, it's, you're, we'll).
- Compassionate, connective tone. Like talking to a friend who genuinely cares.
- Include 2-3 conversational dialogue markers somewhere in the piece: "Right?!", "Know what I mean?", "Does that land?", "How does that make you feel?", "Sound familiar?", "Get this.", "Wild, right?"
- Vary sentence length aggressively. Some fragments. Some long ones. Some just three words.
- Concrete specifics over abstractions. A name. A number. A moment.
- Exactly 3 or 4 Amazon product links embedded naturally in prose, each followed by "(paid link)" in plain text. Use only ASINs from the provided catalog.
- Format: <a href="https://www.amazon.com/dp/ASIN?tag=spankyspinola-20" target="_blank" rel="nofollow sponsored">Product Name (paid link)</a>
- No em-dashes. No en-dashes. Zero. None.
`.trim();
