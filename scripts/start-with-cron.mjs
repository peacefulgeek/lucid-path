#!/usr/bin/env node
/**
 * start-with-cron.mjs
 * Spawns the web server + cron worker together for Render deployment.
 * Start Command: NODE_ENV=production node scripts/start-with-cron.mjs
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Start web server
const web = spawn("node", [path.join(rootDir, "dist", "index.js")], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

web.on("error", (err) => {
  console.error("Web server failed to start:", err);
  process.exit(1);
});

// Start cron worker
const cron = spawn("node", [path.join(__dirname, "cron-worker.mjs")], {
  stdio: "inherit",
  env: process.env,
});

cron.on("error", (err) => {
  console.error("Cron worker failed to start:", err);
  // Don't exit — web server should keep running
});

// Handle shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  web.kill("SIGTERM");
  cron.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  web.kill("SIGINT");
  cron.kill("SIGINT");
  process.exit(0);
});

console.log("The Lucid Path — Web server + Cron worker started.");
