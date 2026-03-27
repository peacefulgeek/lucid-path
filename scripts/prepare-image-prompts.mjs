#!/usr/bin/env node
/**
 * Extracts all 300 image prompts from articles.json for parallel generation
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, '..', 'client', 'src', 'data', 'articles.json');
const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));

// Output prompts for parallel generation
const prompts = data.articles.map((a, i) => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  heroPrompt: a.imageDescription,
  ogPrompt: a.ogImageDescription,
}));

fs.writeFileSync(
  path.join(__dirname, '..', 'image-prompts.json'),
  JSON.stringify(prompts, null, 2)
);

console.log(`Extracted ${prompts.length} image prompts`);
// Print first 3 for verification
prompts.slice(0, 3).forEach(p => {
  console.log(`\n--- ${p.title} ---`);
  console.log(`Hero: ${p.heroPrompt.substring(0, 100)}...`);
});
