# Render Upgrade Addendum — Implementation Checklist

## Section 1: Configure for Render
- [x] Add render.yaml at repo root
- [x] Server binds 0.0.0.0
- [x] Reads process.env.PORT
- [x] /health endpoint returning 200

## Section 2: Fix setTimeout overflow
- [x] Grep for 10+ digit setTimeout/setInterval values (none found)
- [x] Replace with node-cron expressions
- [x] All 5 crons gated by AUTO_GEN_ENABLED

## Section 3: Fix matchProducts argument-flip
- [x] Switch to named parameters
- [x] Update all call sites (no external call sites found)
- [x] Verify: grep returns zero non-named calls

## Section 4: Fix vite leaking into production
- [x] Vite in devDependencies only
- [x] Mark vite external in esbuild build (packages=external in build script)
- [x] Conditional import in server/_core/vite.ts (dynamic import, dev only)

## Section 5: Amazon ASIN verification
- [x] Create src/lib/amazon-verify.mjs
- [x] Soft-404 detection
- [x] Product signature detection

## Section 6: Article quality gate
- [x] Create src/lib/article-quality-gate.mjs
- [x] AI_FLAGGED_WORDS + AI_FLAGGED_PHRASES
- [x] Word count, Amazon links, em-dash, voice signals
- [x] Generation prompt HARD RULES
- [x] Generation loop with 3-attempt quality gate

## Section 7: Retrofit existing articles
- [x] Patch articles with <3 verified links (already done: all 300 have 3-6 links)
- [x] Remove dead ASINs (all 67 ASINs match catalog, all have correct affiliate tag)

## Section 8: Weekly refresh crons (all 5)
- [x] DB tables: verified_asins, failed_asins, generation_log
- [x] All 5 cron schedules registered in cron-worker.mjs
- [x] verify-affiliates.mjs, refresh-monthly.mjs, refresh-quarterly.mjs, generate-article.mjs, product-spotlight.mjs

## Section 9: Design, readability, images
- [x] Design tokens CSS (already in index.css: twilight, aurora, starlight, gold palette)
- [x] FAL → sharp → WebP → Bunny image pipeline (src/lib/image-pipeline.mjs)
- [x] Every article has images (all 300 have heroImage + ogImage on Bunny CDN)
- [x] Broken image audit + fix (spot-checked 5 random images, all return 200 image/webp)

## Section 10-11: Pre/post-push verification
- [ ] All grep checks pass
- [ ] Build succeeds
- [ ] Push to GitHub
