#!/usr/bin/env node
/**
 * cron-worker.mjs
 * All 5 cron schedules for The Lucid Path, gated by AUTO_GEN_ENABLED env var.
 * No Manus. No external dispatcher. Runs inside the web service process.
 *
 * Schedule reference:
 * | # | Schedule                        | Cron Expression      | Job                          |
 * |---|--------------------------------|----------------------|------------------------------|
 * | 1 | Mon-Fri 06:00 UTC              | 0 6 * * 1-5         | Article generation (5/week)  |
 * | 2 | Saturday 08:00 UTC             | 0 8 * * 6           | Product spotlight (1/week)   |
 * | 3 | 1st of month 03:00 UTC         | 0 3 1 * *           | Monthly content refresh      |
 * | 4 | Jan/Apr/Jul/Oct 1st 04:00 UTC  | 0 4 1 1,4,7,10 *    | Quarterly content refresh    |
 * | 5 | Sunday 05:00 UTC               | 0 5 * * 0           | ASIN health check            |
 */

import cron from "node-cron";

export function registerCronJobs() {
  const AUTO_GEN = process.env.AUTO_GEN_ENABLED === "true";

  if (!AUTO_GEN) {
    console.log('[cron] AUTO_GEN_ENABLED != "true" — cron disabled');
    return;
  }

  // 1. Article generation — Mon-Fri 06:00 UTC (5/week)
  cron.schedule('0 6 * * 1-5', async () => {
    console.log(`[cron] generate-article ${new Date().toISOString()}`);
    try {
      const { generateNewArticle } = await import("./cron/generate-article.mjs");
      await generateNewArticle();
    } catch (e) {
      console.error("[cron] generate-article failed:", e);
    }
  }, { timezone: "UTC" });

  // 2. Product spotlight — Saturday 08:00 UTC (1/week)
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try {
      const { generateProductSpotlight } = await import("./cron/product-spotlight.mjs");
      await generateProductSpotlight();
    } catch (e) {
      console.error("[cron] product-spotlight failed:", e);
    }
  }, { timezone: "UTC" });

  // 3. Monthly content refresh — 1st of month 03:00 UTC
  cron.schedule('0 3 1 * *', async () => {
    console.log(`[cron] refresh-monthly ${new Date().toISOString()}`);
    try {
      const { refreshMonthly } = await import("./cron/refresh-monthly.mjs");
      await refreshMonthly();
    } catch (e) {
      console.error("[cron] refresh-monthly failed:", e);
    }
  }, { timezone: "UTC" });

  // 4. Quarterly content refresh — Jan/Apr/Jul/Oct 1st at 04:00 UTC
  cron.schedule('0 4 1 1,4,7,10 *', async () => {
    console.log(`[cron] refresh-quarterly ${new Date().toISOString()}`);
    try {
      const { refreshQuarterly } = await import("./cron/refresh-quarterly.mjs");
      await refreshQuarterly();
    } catch (e) {
      console.error("[cron] refresh-quarterly failed:", e);
    }
  }, { timezone: "UTC" });

  // 5. ASIN health check — Sundays 05:00 UTC
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
    try {
      const { verifyAffiliateLinks } = await import("./cron/verify-affiliates.mjs");
      await verifyAffiliateLinks();
    } catch (e) {
      console.error("[cron] asin-health-check failed:", e);
    }
  }, { timezone: "UTC" });

  console.log("[cron] All 5 schedules registered (AUTO_GEN_ENABLED=true)");
}

// If run directly (not imported), register immediately
const isDirectRun = process.argv[1]?.includes("cron-worker");
if (isDirectRun) {
  registerCronJobs();
}
