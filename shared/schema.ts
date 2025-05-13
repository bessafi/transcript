import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  quotaMinutes: integer("quota_minutes").notNull().default(10),
  isPremium: boolean("is_premium").notNull().default(false),
  apiKey: text("api_key"),
  createdAt: text("created_at").notNull()
});

// Transcriptions schema
export const transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  videoUrl: text("video_url").notNull(),
  platform: text("platform").notNull(),
  videoId: text("video_id").notNull(),
  language: text("language").notNull(),
  transcript: text("transcript").notNull(),
  durationSeconds: integer("duration_seconds"),
  createdAt: text("created_at").notNull()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertTranscriptionSchema = createInsertSchema(transcriptions).pick({
  userId: true,
  videoUrl: true,
  platform: true,
  videoId: true,
  language: true,
  transcript: true,
  durationSeconds: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTranscription = z.infer<typeof insertTranscriptionSchema>;
export type Transcription = typeof transcriptions.$inferSelect;
