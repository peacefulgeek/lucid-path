/**
 * Backlink Redistribution Script
 * 
 * Target distribution (300 articles):
 * - 14% (42) → kalesh.love (dofollow, varied anchor text)
 * - 33% (99) → Product links (Amazon with tag=spankyspinola-20, dofollow)
 * - 23% (69) → Organization/research/authority (nofollow)
 * - 30% (90) → Internal links only (no outbound)
 * 
 * Rules:
 * - Keep existing internal cross-links (3-5 per article)
 * - Product links prioritize books by researchers named in the article
 * - Don't change article titles, core structure, images, or main body text
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'client', 'src', 'data', 'articles.json');

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
const articles = data.articles;

const TAG = "spankyspinola-20";
const amz = (asin) => `https://www.amazon.com/dp/${asin}?tag=${TAG}`;

// Kalesh anchor text variations
const kaleshAnchors = [
  "explore Kalesh's teachings on consciousness",
  "learn more from Kalesh",
  "Kalesh's approach to awareness",
  "visit Kalesh's work on embodied consciousness",
  "Kalesh writes about this beautifully",
  "read Kalesh's perspective",
  "Kalesh's guidance on this practice",
  "discover more through Kalesh's teachings",
  "Kalesh explores this in depth",
  "Kalesh's insights on dream awareness",
  "explore Kalesh's writing on this",
  "Kalesh's work on contemplative practice",
  "learn from Kalesh's experience",
  "Kalesh's approach to inner work",
  "visit Kalesh for deeper guidance",
  "Kalesh offers wisdom on this",
  "explore this further with Kalesh",
  "Kalesh's perspective on consciousness",
  "Kalesh teaches this with remarkable clarity",
  "discover Kalesh's approach",
  "Kalesh's writing on awareness practices",
  "learn more at Kalesh's site",
  "Kalesh's contemplative teachings",
  "explore Kalesh's consciousness work",
  "Kalesh's guidance for seekers",
  "read more from Kalesh",
  "Kalesh's wisdom on this topic",
  "visit Kalesh's teachings",
  "Kalesh's approach to dream consciousness",
  "explore this with Kalesh",
  "Kalesh's insights on meditation and dreams",
  "Kalesh's work on lucid awareness",
  "discover Kalesh's teachings",
  "Kalesh's perspective on inner exploration",
  "learn from Kalesh's contemplative practice",
  "Kalesh writes about awareness beautifully",
  "Kalesh's guidance on this journey",
  "explore Kalesh's consciousness teachings",
  "Kalesh's approach to waking up",
  "visit Kalesh for more on this",
  "Kalesh's insights into dream practice",
  "Kalesh's work bridges ancient and modern",
];

// Product links — real Amazon ASINs matched to article topics
const productLinks = {
  // Books by researchers
  "laberge": { url: amz("034537410X"), anchor: "Exploring the World of Lucid Dreaming by Stephen LaBerge" },
  "laberge-concise": { url: amz("159179675X"), anchor: "LaBerge's Concise Guide to Lucid Dreaming" },
  "waggoner": { url: amz("193049114X"), anchor: "Lucid Dreaming: Gateway to the Inner Self by Robert Waggoner" },
  "walker": { url: amz("1501144324"), anchor: "Why We Sleep by Matthew Walker" },
  "holecek": { url: amz("1622034589"), anchor: "Dream Yoga by Andrew Holecek" },
  "love": { url: amz("0957497709"), anchor: "Are You Dreaming? by Daniel Love" },
  "rinpoche": { url: amz("1559391014"), anchor: "The Tibetan Yogas of Dream and Sleep by Tenzin Wangyal Rinpoche" },
  // Supplements
  "galantamine": { url: amz("B0758FYZVC"), anchor: "Galantamine supplement for lucid dreaming" },
  "dream-leaf": { url: amz("B07PCVWM6N"), anchor: "Dream Leaf Pro lucid dreaming supplement" },
  "alpha-gpc": { url: amz("B01EBUIWDQ"), anchor: "Alpha GPC choline supplement" },
  "mugwort": { url: amz("B07BFNM7PL"), anchor: "organic mugwort dream herb" },
  // Tools
  "sleep-mask": { url: amz("B07PRG2CQB"), anchor: "Manta blackout sleep mask" },
  "journal": { url: amz("B0DQJRP5YQ"), anchor: "a dedicated lucid dreaming journal" },
  "moleskine": { url: amz("8883701127"), anchor: "a quality dream journal notebook" },
  "singing-bowl": { url: amz("B07XLHC1Z5"), anchor: "a Tibetan singing bowl for meditation" },
  "zafu": { url: amz("B0002046F8"), anchor: "a proper meditation cushion" },
  "hatch": { url: amz("B0C5S7K1JK"), anchor: "a sunrise alarm clock for gentle wake-ups" },
  "bt-mask": { url: amz("B0CX4YJ5Y7"), anchor: "a Bluetooth sleep mask for audio cues" },
};

// Organization/authority links (nofollow)
const orgLinks = [
  { url: "https://www.sleepfoundation.org/", anchor: "the Sleep Foundation" },
  { url: "https://aasm.org/", anchor: "the American Academy of Sleep Medicine" },
  { url: "https://www.apa.org/topics/sleep", anchor: "the American Psychological Association's sleep resources" },
  { url: "https://www.nhlbi.nih.gov/health/sleep", anchor: "the National Heart, Lung, and Blood Institute" },
  { url: "https://pubmed.ncbi.nlm.nih.gov/", anchor: "PubMed research database" },
  { url: "https://www.lucidity.com/", anchor: "the Lucidity Institute" },
  { url: "https://www.frontiersin.org/journals/psychology", anchor: "Frontiers in Psychology" },
  { url: "https://www.nature.com/subjects/sleep", anchor: "Nature's sleep research collection" },
  { url: "https://www.sciencedirect.com/topics/neuroscience/lucid-dream", anchor: "ScienceDirect's lucid dreaming research" },
  { url: "https://www.world-of-lucid-dreaming.com/", anchor: "World of Lucid Dreaming" },
  { url: "https://www.ncbi.nlm.nih.gov/pmc/", anchor: "the National Center for Biotechnology Information" },
  { url: "https://www.mindandlife.org/", anchor: "the Mind & Life Institute" },
  { url: "https://www.dharma.org/", anchor: "the Insight Meditation Society" },
  { url: "https://www.spiritrock.org/", anchor: "Spirit Rock Meditation Center" },
  { url: "https://plato.stanford.edu/entries/consciousness/", anchor: "the Stanford Encyclopedia of Philosophy on consciousness" },
  { url: "https://consciousness.arizona.edu/", anchor: "the Center for Consciousness Studies" },
  { url: "https://www.sleepresearchsociety.org/", anchor: "the Sleep Research Society" },
  { url: "https://www.psychologytoday.com/us/basics/lucid-dreaming", anchor: "Psychology Today's lucid dreaming overview" },
  { url: "https://www.nih.gov/news-events/nih-research-matters/sleep", anchor: "the National Institutes of Health sleep research" },
  { url: "https://www.who.int/health-topics/mental-health", anchor: "the World Health Organization's mental health resources" },
  { url: "https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/sleep/art-20048379", anchor: "the Mayo Clinic's sleep guide" },
  { url: "https://www.harvardmagazine.com/topic/sleep", anchor: "Harvard Magazine's sleep research" },
  { url: "https://neuroscience.stanford.edu/", anchor: "Stanford Neurosciences Institute" },
];

// Match articles to product links based on content/category/researcher
function getProductLink(article, index) {
  const text = `${article.title} ${article.opener || ''} ${article.metaDescription || ''}`.toLowerCase();
  const sections = article.sections || [];
  const sectionText = sections.map(s => (s.heading || s.h2 || '')).join(' ').toLowerCase();
  const fullText = `${text} ${sectionText}`;
  
  // Match by researcher mentioned
  if (fullText.includes('laberge') || fullText.includes('la berge')) {
    return index % 2 === 0 ? productLinks["laberge"] : productLinks["laberge-concise"];
  }
  if (fullText.includes('waggoner')) return productLinks["waggoner"];
  if (fullText.includes('walker') || fullText.includes('why we sleep')) return productLinks["walker"];
  if (fullText.includes('holecek') || fullText.includes('dream yoga')) return productLinks["holecek"];
  if (fullText.includes('daniel love') || fullText.includes('are you dreaming')) return productLinks["love"];
  if (fullText.includes('rinpoche') || fullText.includes('tibetan yoga')) return productLinks["rinpoche"];
  
  // Match by topic
  if (fullText.includes('supplement') || fullText.includes('galantamine')) return productLinks["galantamine"];
  if (fullText.includes('alpha gpc') || fullText.includes('choline')) return productLinks["alpha-gpc"];
  if (fullText.includes('mugwort') || fullText.includes('dream herb')) return productLinks["mugwort"];
  if (fullText.includes('sleep mask') || fullText.includes('darkness')) return productLinks["sleep-mask"];
  if (fullText.includes('journal') || fullText.includes('dream diary')) {
    return index % 2 === 0 ? productLinks["journal"] : productLinks["moleskine"];
  }
  if (fullText.includes('meditation') || fullText.includes('mindfulness')) {
    return index % 3 === 0 ? productLinks["zafu"] : index % 3 === 1 ? productLinks["singing-bowl"] : productLinks["zafu"];
  }
  if (fullText.includes('wild') || fullText.includes('wake initiated') || fullText.includes('audio')) return productLinks["bt-mask"];
  if (fullText.includes('wbtb') || fullText.includes('wake back') || fullText.includes('alarm')) return productLinks["hatch"];
  if (fullText.includes('rem') || fullText.includes('sleep cycle') || fullText.includes('sleep stage')) return productLinks["walker"];
  if (fullText.includes('mild') || fullText.includes('reality test') || fullText.includes('reality check')) return productLinks["love"];
  
  // Category-based fallbacks
  const cat = article.category;
  if (cat === 'the-basics') return productLinks["laberge"];
  if (cat === 'the-techniques') return productLinks["love"];
  if (cat === 'the-science') return productLinks["walker"];
  if (cat === 'the-practice') return productLinks["journal"];
  if (cat === 'the-advanced') return productLinks["holecek"];
  
  return productLinks["laberge"]; // ultimate fallback
}

// Shuffle array deterministically
function shuffle(arr, seed = 42) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Assign distribution
const shuffled = shuffle(articles.map((_, i) => i));
const kaleshCount = 42;   // 14%
const productCount = 99;  // 33%
const orgCount = 69;      // 23%
const internalCount = 90; // 30%

const kaleshIndices = new Set(shuffled.slice(0, kaleshCount));
const productIndices = new Set(shuffled.slice(kaleshCount, kaleshCount + productCount));
const orgIndices = new Set(shuffled.slice(kaleshCount + productCount, kaleshCount + productCount + orgCount));
const internalIndices = new Set(shuffled.slice(kaleshCount + productCount + orgCount));

let kaleshUsed = 0, productUsed = 0, orgUsed = 0, internalUsed = 0;

for (let i = 0; i < articles.length; i++) {
  const article = articles[i];
  
  if (kaleshIndices.has(i)) {
    // Kalesh link
    article.backlinkType = "intermediary";
    article.outboundLink = {
      url: "https://kalesh.love",
      anchor: kaleshAnchors[kaleshUsed % kaleshAnchors.length],
    };
    kaleshUsed++;
  } else if (productIndices.has(i)) {
    // Product link
    const product = getProductLink(article, i);
    article.backlinkType = "product";
    article.outboundLink = {
      url: product.url,
      anchor: product.anchor,
    };
    productUsed++;
  } else if (orgIndices.has(i)) {
    // Organization link (nofollow)
    const org = orgLinks[orgUsed % orgLinks.length];
    article.backlinkType = "organization";
    article.outboundLink = {
      url: org.url,
      anchor: org.anchor,
      rel: "nofollow",
    };
    orgUsed++;
  } else {
    // Internal only
    article.backlinkType = "internal-only";
    article.outboundLink = null;
    internalUsed++;
  }
}

// Write back
writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`Backlink redistribution complete:`);
console.log(`  Kalesh (intermediary): ${kaleshUsed} (${(kaleshUsed/300*100).toFixed(1)}%)`);
console.log(`  Product (Amazon): ${productUsed} (${(productUsed/300*100).toFixed(1)}%)`);
console.log(`  Organization (nofollow): ${orgUsed} (${(orgUsed/300*100).toFixed(1)}%)`);
console.log(`  Internal only: ${internalUsed} (${(internalUsed/300*100).toFixed(1)}%)`);
console.log(`  Total: ${kaleshUsed + productUsed + orgUsed + internalUsed}`);

// Verify Amazon links all have correct tag
let amazonLinks = 0;
let untagged = 0;
for (const article of articles) {
  if (article.outboundLink && article.outboundLink.url.includes('amazon.com')) {
    amazonLinks++;
    if (!article.outboundLink.url.includes('tag=spankyspinola-20')) {
      untagged++;
    }
  }
}
console.log(`\nAmazon links: ${amazonLinks}, untagged: ${untagged}`);
