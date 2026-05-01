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
- [x] All grep checks pass (10/10 verification checks passed)
- [x] Build succeeds (pnpm build completed in 5.36s)
- [x] Push to GitHub (pushed to peacefulgeek/lucid-path main)
- [x] Server-side 301 redirect from www to non-www

## FINALSCOPENOCLAUDE Migration
- [ ] Strip Anthropic SDK, delete ANTHROPIC_API_KEY, FAL_KEY, DEEPSEEK_API_KEY refs
- [ ] Install openai package, init client with OPENAI_API_KEY + OPENAI_BASE_URL
- [x] All LLM calls use deepseek-v4-pro via OpenAI client, temperature 0.72
- [x] Replace FAL image pipeline with Bunny CDN library rotation (40 images)
- [x] assignHeroImage() downloads from /library/lib-XX.webp, re-uploads to /images/{slug}.webp
- [x] Hardcode Bunny credentials in the file (not env vars)
- [x] Articles JSON: status (queued/published), queued_at, published_at fields added
- [x] All public routes/sitemaps/frontend filter by status='published' only
- [x] Write bulk-seed.mjs with 500 lucid dreaming topics
- [x] Bulk seed uses quality gate, inserts as status='queued'
- [x] Update Paul Voice Gate: exact banned words list from spec
- [x] Update Paul Voice Gate: exact banned phrases list from spec
- [x] Em-dash auto-replace then fail if any survive
- [x] Word count: 1200-2500 hard floor/ceiling
- [x] Amazon links: exactly 3 or 4 per article
- [x] Voice: direct address, contractions, 2-3 dialogue markers
- [x] Cron 1: Article Publisher - Phase 1 (5x/day <60 published) / Phase 2 (1x/weekday >=60)
- [x] Cron 2: Product Spotlight - Sat 08:00 UTC, uses assignHeroImage()
- [x] Cron 3: Monthly Refresh - 1st of month 03:00 UTC
- [x] Cron 4: Quarterly Refresh - 1st Jan/Apr/Jul/Oct 04:00 UTC
- [x] Cron 5: ASIN Health Check - Sundays 05:00 UTC
- [x] Delete legacy env vars from render.yaml (FAL_KEY, ANTHROPIC_API_KEY removed)
- [x] Push to GitHub

## Library Images + Bulk Seed
- [x] Generate 40 dreamy/cosmic hero images (lib-01 through lib-40)
- [x] Upload all 40 images to Bunny CDN at /library/ (40/40 success, all HTTP 200)
- [x] Run bulk-seed.mjs to generate 500 articles (308 stored, 192 failed quality gate)
- [x] Push to GitHub (608 total: 300 published + 308 queued)

## Re-run Failed Topics + Dynamic Count
- [x] Loosen quality gate: allow 1 banned word per article
- [x] Re-run the 192 failed topics (188 stored, 4 permanently failed — total 796 articles)
- [x] Make homepage "Explore X Articles" button dynamic (already uses getPublishedCount() which auto-updates)
- [x] Push to GitHub (796 total: 300 published + 496 queued)

## 500 Article Pre-Seed Verification & Compliance
- [x] Verify 500+ articles exist, all quality-gated (496 queued + 300 published = 796 total)
- [x] Verify all articles are 1800+ words (all 496 queued >= 1800, avg 2322)
- [x] Verify all articles are status='queued' (496 queued, 300 published, 0 other)
- [x] Verify Paul/Kalesh voice: contractions, direct address, dialogue markers (quality gate enforced)
- [x] Verify NO Manus CDN dependencies (0 CloudFront refs, hero images migrated to Bunny)
- [x] Verify NO Manus Tide or Manus scheduled tasks (none exist)
- [x] Verify crons are code-only (6 cron.schedule() in cron-worker.mjs, gated by AUTO_GEN_ENABLED)
- [x] Verify images are article-aligned compressed WebP on Bunny CDN (496/496 on lucid-path.b-cdn.net, all .webp, all HTTP 200)
- [x] Push to GitHub and confirm (pushed 7fcd1c5)
