#!/usr/bin/env node
/**
 * cron-worker.mjs
 * All 5 cron schedules for The Lucid Path, gated by AUTO_GEN_ENABLED env var.
 * Runs inside the web service process via start-with-cron.mjs.
 *
 * Schedule reference:
 * | # | Job                  | Schedule                                                        |
 * |---|---------------------|-----------------------------------------------------------------|
 * | 1 | Article Publisher   | Phase 1 (<60 published): 5x/day every day (07,10,13,16,19 UTC) |
 * |   |                     | Phase 2 (>=60 published): 1x/weekday (08:00 UTC Mon-Fri)       |
 * | 2 | Product Spotlight   | Saturdays 08:00 UTC                                            |
 * | 3 | Monthly Refresh     | 1st of month 03:00 UTC                                         |
 * | 4 | Quarterly Refresh   | 1st of Jan/Apr/Jul/Oct 04:00 UTC                               |
 * | 5 | ASIN Health Check   | Sundays 05:00 UTC                                              |
 */

import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getPublishedCount() {
  try {
    const articlesPath = path.resolve(__dirname, '../client/src/data/articles.json');
    const data = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
    return (data.articles || []).filter(a => a.status === 'published' || !a.status).length;
  } catch {
    return 0;
  }
}

export function registerCronJobs() {
  const AUTO_GEN = process.env.AUTO_GEN_ENABLED === "true";

  if (!AUTO_GEN) {
    console.log('[cron] AUTO_GEN_ENABLED != "true" - cron disabled');
    return;
  }

  // Helper: run the article publisher
  async function runArticlePublisher() {
    console.log(`[cron] article-publisher ${new Date().toISOString()}`);
    try {
      const { generateAndPublish } = await import("./cron/generate-article.mjs");
      await generateAndPublish();
    } catch (e) {
      console.error("[cron] article-publisher failed:", e);
    }
  }

  // 1. Article Publisher — Phase-based schedule
  //    Phase 1 (<60 published): 5x/day EVERY day at 07:00, 10:00, 13:00, 16:00, 19:00 UTC
  //    Phase 2 (>=60 published): 1x/weekday at 08:00 UTC Mon-Fri
  //
  //    We register BOTH schedules and check the count at runtime.

  // Phase 1 schedule: 07, 10, 13, 16, 19 UTC every day
  cron.schedule('0 7,10,13,16,19 * * *', async () => {
    const count = getPublishedCount();
    if (count < 60) {
      await runArticlePublisher();
    } else {
      console.log(`[cron] Phase 1 skip: ${count} published (>=60, Phase 2 active)`);
    }
  }, { timezone: "UTC" });

  // Phase 2 schedule: 08:00 UTC Mon-Fri
  cron.schedule('0 8 * * 1-5', async () => {
    const count = getPublishedCount();
    if (count >= 60) {
      await runArticlePublisher();
    } else {
      console.log(`[cron] Phase 2 skip: ${count} published (<60, Phase 1 active)`);
    }
  }, { timezone: "UTC" });

  // 2. Product Spotlight — Saturday 08:00 UTC
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try {
      const { generateProductSpotlight } = await import("./cron/product-spotlight.mjs");
      await generateProductSpotlight();
    } catch (e) {
      console.error("[cron] product-spotlight failed:", e);
    }
  }, { timezone: "UTC" });

  // 3. Monthly Refresh — 1st of month 03:00 UTC
  cron.schedule('0 3 1 * *', async () => {
    console.log(`[cron] refresh-monthly ${new Date().toISOString()}`);
    try {
      const { refreshMonthly } = await import("./cron/refresh-monthly.mjs");
      await refreshMonthly();
    } catch (e) {
      console.error("[cron] refresh-monthly failed:", e);
    }
  }, { timezone: "UTC" });

  // 4. Quarterly Refresh — Jan/Apr/Jul/Oct 1st at 04:00 UTC
  cron.schedule('0 4 1 1,4,7,10 *', async () => {
    console.log(`[cron] refresh-quarterly ${new Date().toISOString()}`);
    try {
      const { refreshQuarterly } = await import("./cron/refresh-quarterly.mjs");
      await refreshQuarterly();
    } catch (e) {
      console.error("[cron] refresh-quarterly failed:", e);
    }
  }, { timezone: "UTC" });

  // 5. ASIN Health Check — Sundays 05:00 UTC
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
    try {
      const { verifyAffiliateLinks } = await import("./cron/verify-affiliates.mjs");
      await verifyAffiliateLinks();
    } catch (e) {
      console.error("[cron] asin-health-check failed:", e);
    }
  }, { timezone: "UTC" });

  const count = getPublishedCount();
  const phase = count < 60 ? '1 (5x/day every day)' : '2 (1x/weekday)';
  console.log(`[cron] All schedules registered. Published: ${count}, Article phase: ${phase}`);
}

// If run directly (not imported), register immediately
const isDirectRun = process.argv[1]?.includes("cron-worker");
if (isDirectRun) {
  registerCronJobs();
}
