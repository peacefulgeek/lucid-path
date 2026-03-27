#!/usr/bin/env node
/**
 * cron-worker.mjs
 * Mon-Fri 12:00 UTC, 600s timeout
 * AUTO_GEN_ENABLED = false — Wildman flips to true on GitHub when ready.
 */

import { schedule } from "node-cron";

const AUTO_GEN_ENABLED = false;

async function generateDailyArticles() {
  if (!AUTO_GEN_ENABLED) {
    console.log("[cron] Auto-gen is disabled. Set AUTO_GEN_ENABLED = true to activate.");
    return;
  }

  console.log("[cron] Starting daily article generation...");
  const startTime = Date.now();

  try {
    // Dynamic import of the generator
    const { generateArticles } = await import("./generate-articles.mjs");
    await generateArticles();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[cron] Article generation completed in ${elapsed}s`);
  } catch (err) {
    console.error("[cron] Article generation failed:", err);
  }
}

// Schedule: Mon-Fri at 12:00 UTC
// Cron format: second minute hour day-of-month month day-of-week
schedule("0 0 12 * * 1-5", () => {
  const timeout = setTimeout(() => {
    console.error("[cron] Article generation timed out after 600s");
  }, 600000);

  generateDailyArticles().finally(() => clearTimeout(timeout));
}, {
  timezone: "UTC",
});

console.log("[cron] Cron worker started. Schedule: Mon-Fri 12:00 UTC. AUTO_GEN_ENABLED:", AUTO_GEN_ENABLED);
