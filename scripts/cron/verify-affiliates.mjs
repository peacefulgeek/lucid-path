/**
 * verify-affiliates.mjs
 * Weekly ASIN health check — verifies all ASINs in the catalog,
 * updates verified_asins and failed_asins DB tables,
 * and flags broken links for replacement.
 */

import { verifyAsinBatch } from '../../src/lib/amazon-verify.mjs';
import fs from 'fs';
import path from 'path';

function loadCatalogAsins() {
  const catalogPath = path.resolve(import.meta.dirname, '../../client/src/lib/product-catalog.ts');
  const raw = fs.readFileSync(catalogPath, 'utf-8');
  const products = [];
  const regex = /\{\s*name:\s*"([^"]+)",\s*asin:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
  let m;
  while ((m = regex.exec(raw)) !== null) {
    products.push({ name: m[1], asin: m[2], category: m[3] });
  }
  return products;
}

/**
 * Try to update DB tables. If DB is unavailable, fall back to file-based reports.
 */
async function updateDb(active, dead, catalog) {
  try {
    // Dynamic import to avoid hard dependency on DB being available
    const { drizzle } = await import('drizzle-orm/mysql2');
    const { verifiedAsins, failedAsins } = await import('../../drizzle/schema.ts');
    const { eq } = await import('drizzle-orm');

    if (!process.env.DATABASE_URL) {
      console.log('[verify] No DATABASE_URL, skipping DB update');
      return false;
    }

    const db = drizzle(process.env.DATABASE_URL);
    const now = new Date();

    // Upsert active ASINs
    for (const r of active) {
      const cat = catalog.find(p => p.asin === r.asin)?.category || 'unknown';
      await db.insert(verifiedAsins).values({
        asin: r.asin,
        title: r.title || null,
        category: cat,
        lastChecked: now,
        lastValid: now,
        httpStatus: 200,
        isActive: true,
      }).onDuplicateKeyUpdate({
        set: {
          title: r.title || null,
          lastChecked: now,
          lastValid: now,
          httpStatus: 200,
          isActive: true,
        }
      });
    }

    // Upsert dead ASINs
    for (const r of dead) {
      const cat = catalog.find(p => p.asin === r.asin)?.category || 'unknown';
      await db.insert(failedAsins).values({
        asin: r.asin,
        reason: r.reason || 'unknown',
        title: r.title || null,
        category: cat,
        lastChecked: now,
        failedAt: now,
      }).onDuplicateKeyUpdate({
        set: {
          reason: r.reason || 'unknown',
          lastChecked: now,
        }
      });

      // Also mark as inactive in verified_asins if it was there
      await db.update(verifiedAsins)
        .set({ isActive: false, lastChecked: now })
        .where(eq(verifiedAsins.asin, r.asin));
    }

    console.log(`[verify] DB updated: ${active.length} verified, ${dead.length} failed`);
    return true;
  } catch (e) {
    console.warn('[verify] DB update failed, using file-based report:', e.message);
    return false;
  }
}

export async function verifyAffiliateLinks() {
  console.log('[verify] Starting weekly ASIN health check...');

  const catalog = loadCatalogAsins();
  const allAsins = catalog.map(p => p.asin);

  // Verify all ASINs
  const results = await verifyAsinBatch(allAsins, 2500);
  const active = results.filter(r => r.valid);
  const dead = results.filter(r => !r.valid);

  console.log(`[verify] Results: ${active.length} active, ${dead.length} dead out of ${allAsins.length}`);

  // Try DB update
  await updateDb(active, dead, catalog);

  // Always write file-based report
  const reportDir = path.resolve(import.meta.dirname, '../reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

  const report = {
    date: new Date().toISOString(),
    summary: {
      total: allAsins.length,
      active: active.length,
      dead: dead.length,
    },
    active: active.map(r => ({ asin: r.asin, title: r.title })),
    dead: dead.map(r => ({ asin: r.asin, reason: r.reason })),
  };

  fs.writeFileSync(
    path.join(reportDir, `verify-${new Date().toISOString().slice(0, 10)}.json`),
    JSON.stringify(report, null, 2)
  );

  if (dead.length > 0) {
    console.warn('[verify] DEAD ASINs requiring attention:');
    for (const d of dead) {
      console.warn(`  ${d.asin}: ${d.reason}`);
    }
  }

  return report;
}
