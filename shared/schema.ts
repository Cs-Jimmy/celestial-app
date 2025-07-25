import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mood: text("mood").notNull(),
  intensity: integer("intensity").notNull(),
  note: text("note"),
  date: timestamp("date").notNull().defaultNow(),
  stardate: text("stardate").notNull(),
});

export const missionLogs = pgTable("mission_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  status: text("status").notNull().default("ongoing"),
  entryType: text("entry_type").notNull().default("text"),
  audioData: text("audio_data"),
  audioDuration: real("audio_duration"),
  stardate: text("stardate").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const voiceRecordings = pgTable("voice_recordings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  missionLogId: varchar("mission_log_id").notNull(),
  audioData: text("audio_data").notNull(),
  duration: real("duration").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMoodSchema = createInsertSchema(moods).omit({
  id: true,
  userId: true,
  date: true,
});

export const insertMissionLogSchema = createInsertSchema(missionLogs).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertVoiceRecordingSchema = createInsertSchema(voiceRecordings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;

export type InsertMissionLog = z.infer<typeof insertMissionLogSchema>;
export type MissionLog = typeof missionLogs.$inferSelect;

export type InsertVoiceRecording = z.infer<typeof insertVoiceRecordingSchema>;
export type VoiceRecording = typeof voiceRecordings.$inferSelect;
