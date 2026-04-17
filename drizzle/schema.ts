import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Verified Amazon ASINs — products confirmed active via HTTP check.
 * Updated by the weekly ASIN health check cron.
 */
export const verifiedAsins = mysqlTable("verified_asins", {
  id: int("id").autoincrement().primaryKey(),
  asin: varchar("asin", { length: 10 }).notNull().unique(),
  title: text("title"),
  category: varchar("category", { length: 64 }),
  lastChecked: timestamp("lastChecked").defaultNow().notNull(),
  lastValid: timestamp("lastValid").defaultNow().notNull(),
  httpStatus: int("httpStatus"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VerifiedAsin = typeof verifiedAsins.$inferSelect;
export type InsertVerifiedAsin = typeof verifiedAsins.$inferInsert;

/**
 * Failed/dead ASINs — products that returned 404, soft-404, or unavailable.
 * Kept for audit trail and to prevent re-use.
 */
export const failedAsins = mysqlTable("failed_asins", {
  id: int("id").autoincrement().primaryKey(),
  asin: varchar("asin", { length: 10 }).notNull().unique(),
  reason: varchar("reason", { length: 128 }).notNull(),
  title: text("title"),
  category: varchar("category", { length: 64 }),
  lastChecked: timestamp("lastChecked").defaultNow().notNull(),
  failedAt: timestamp("failedAt").defaultNow().notNull(),
  articleSlugs: text("articleSlugs"), // JSON array of article slugs that reference this ASIN
  replacedBy: varchar("replacedBy", { length: 10 }), // ASIN that replaced this one
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FailedAsin = typeof failedAsins.$inferSelect;
export type InsertFailedAsin = typeof failedAsins.$inferInsert;

/**
 * Article generation log — tracks every generation attempt for audit.
 */
export const generationLog = mysqlTable("generation_log", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 256 }),
  topic: text("topic"),
  category: varchar("category", { length: 64 }),
  attempt: int("attempt").notNull(),
  passed: boolean("passed").default(false).notNull(),
  failures: text("failures"), // JSON array of quality gate failures
  wordCount: int("wordCount"),
  amazonLinks: int("amazonLinks"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GenerationLog = typeof generationLog.$inferSelect;
export type InsertGenerationLog = typeof generationLog.$inferInsert;
