import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
 * Forms table - stores form definitions created by users
 */
export const forms = mysqlTable("forms", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  /** JSON structure containing field definitions */
  fields: text("fields").notNull(),
  /** JSON structure containing style customizations */
  styles: text("styles").notNull(),
  /** Whether the form is published and accessible via embed */
  published: int("published").default(0).notNull(), // 0 = draft, 1 = published
  /** Whether to send email notifications on new submissions */
  emailNotifications: int("emailNotifications").default(1).notNull(), // 0 = disabled, 1 = enabled
  /** Webhook URL to send submission data to external services */
  webhookUrl: varchar("webhookUrl", { length: 512 }),
  autoResponderEnabled: int("autoResponderEnabled").default(0).notNull(),
  autoResponderSubject: varchar("autoResponderSubject", { length: 255 }),
  autoResponderMessage: text("autoResponderMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Form = typeof forms.$inferSelect;
export type InsertForm = typeof forms.$inferInsert;

/**
 * Submissions table - stores form submission data
 */
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  formId: int("formId").notNull(),
  /** JSON structure containing submitted field values */
  data: text("data").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;

export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  formId: int("formId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "editor", "viewer"]).notNull(),
  invitedBy: int("invitedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

// Analytics table for tracking form views and interactions
export const formAnalytics = mysqlTable("formAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  formId: int("formId").notNull(),
  /** Event type: 'view', 'start', 'submit', 'abandon' */
  event: varchar("event", { length: 50 }).notNull(),
  /** Unique session identifier for tracking user journey */
  sessionId: varchar("sessionId", { length: 100 }),
  /** IP address of the visitor */
  ipAddress: varchar("ipAddress", { length: 45 }),
  /** User agent string */
  userAgent: text("userAgent"),
  /** Referrer URL */
  referrer: text("referrer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FormAnalytics = typeof formAnalytics.$inferSelect;
export type InsertFormAnalytics = typeof formAnalytics.$inferInsert;