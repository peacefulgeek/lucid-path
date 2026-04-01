#!/usr/bin/env node
/**
 * cron-worker.mjs
 * Phased article generation schedule:
 *   Phase 1 (first 12 weeks): 5 articles/day, Mon-Fri at 12:00 UTC
 *   Phase 2 (after 12 weeks): 5 articles/week, Mondays at 12:00 UTC
 *
 * Product spotlight: 1 spotlight article every Saturday at 14:00 UTC
 *
 * AUTO_GEN_ENABLED = false — flip to true on GitHub when ready.
 * All API keys from process.env. 600s timeout per run.
 */

import { schedule } from "node-cron";

const AUTO_GEN_ENABLED = false;

// Phase 1 launch date — set this to the actual go-live date
const LAUNCH_DATE = new Date("2026-04-01T00:00:00Z");
const PHASE_1_WEEKS = 12;
const PHASE_1_END = new Date(LAUNCH_DATE.getTime() + PHASE_1_WEEKS * 7 * 24 * 60 * 60 * 1000);

function getCurrentPhase() {
  const now = new Date();
  if (now < PHASE_1_END) {
    return { phase: 1, label: "Phase 1: 5 articles/day Mon-Fri", articlesPerRun: 5 };
  }
  return { phase: 2, label: "Phase 2: 5 articles/week Mondays", articlesPerRun: 5 };
}

async function generateArticles(count) {
  if (!AUTO_GEN_ENABLED) {
    console.log("[cron] Auto-gen is disabled. Set AUTO_GEN_ENABLED = true to activate.");
    return;
  }

  const phase = getCurrentPhase();
  console.log(`[cron] ${phase.label} — Generating ${count} articles...`);
  const startTime = Date.now();

  try {
    const { generateArticles: gen } = await import("./generate-articles.mjs");
    await gen(count);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[cron] Generation completed in ${elapsed}s`);
  } catch (err) {
    console.error("[cron] Article generation failed:", err);
  }
}

async function generateProductSpotlight() {
  if (!AUTO_GEN_ENABLED) {
    console.log("[cron] Auto-gen is disabled. Skipping product spotlight.");
    return;
  }

  console.log("[cron] Generating weekly product spotlight article...");
  const startTime = Date.now();

  try {
    const { generateSpotlight } = await import("./generate-articles.mjs");
    await generateSpotlight();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[cron] Product spotlight completed in ${elapsed}s`);
  } catch (err) {
    console.error("[cron] Product spotlight generation failed:", err);
  }
}

// ─── PHASE 1: Mon-Fri at 12:00 UTC (5 articles/day) ───
schedule("0 0 12 * * 1-5", () => {
  const phase = getCurrentPhase();
  if (phase.phase !== 1) return; // Phase 1 expired, skip

  const timeout = setTimeout(() => {
    console.error("[cron] Generation timed out after 600s");
  }, 600000);

  generateArticles(5).finally(() => clearTimeout(timeout));
}, {
  timezone: "UTC",
});

// ─── PHASE 2: Mondays only at 12:00 UTC (5 articles/week) ───
schedule("0 0 12 * * 1", () => {
  const phase = getCurrentPhase();
  if (phase.phase !== 2) return; // Still in Phase 1, skip

  const timeout = setTimeout(() => {
    console.error("[cron] Generation timed out after 600s");
  }, 600000);

  generateArticles(5).finally(() => clearTimeout(timeout));
}, {
  timezone: "UTC",
});

// ─── PRODUCT SPOTLIGHT: Saturdays at 14:00 UTC ───
schedule("0 0 14 * * 6", () => {
  const timeout = setTimeout(() => {
    console.error("[cron] Product spotlight timed out after 600s");
  }, 600000);

  generateProductSpotlight().finally(() => clearTimeout(timeout));
}, {
  timezone: "UTC",
});

const phase = getCurrentPhase();
console.log(`[cron] Worker started. Current: ${phase.label}`);
console.log(`[cron] Phase 1 ends: ${PHASE_1_END.toISOString()}`);
console.log(`[cron] Product spotlight: Saturdays at 14:00 UTC`);
console.log(`[cron] AUTO_GEN_ENABLED: ${AUTO_GEN_ENABLED}`);
