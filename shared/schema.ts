// Database schema definitions - this defines what data we store and how
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores user accounts (currently using demo mode)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique user ID
  username: text("username").notNull().unique(), // Login username
  password: text("password").notNull(), // Encrypted password
});

// Moods table - stores mood tracking entries 
export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique mood entry ID
  userId: varchar("user_id").notNull(), // Which user this belongs to
  mood: text("mood").notNull(), // Mood type (happy, sad, etc.)
  intensity: integer("intensity").notNull(), // How strong the mood is (1-10)
  note: text("note"), // Optional note about the mood
  date: timestamp("date").notNull().defaultNow(), // When mood was recorded
  stardate: text("stardate").notNull(), // Space-themed timestamp
});

// Mission logs table - stores journal entries (text and voice)
export const missionLogs = pgTable("mission_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique log entry ID
  userId: varchar("user_id").notNull(), // Which user this belongs to
  title: text("title").notNull(), // Journal entry title
  content: text("content"), // Text content of the journal
  status: text("status").notNull().default("ongoing"), // Entry status
  entryType: text("entry_type").notNull().default("text"), // "text" or "voice"
  audioData: text("audio_data"), // Voice recording data (base64)
  audioDuration: real("audio_duration"), // Length of audio in seconds
  stardate: text("stardate").notNull(), // Space-themed timestamp
  createdAt: timestamp("created_at").notNull().defaultNow(), // When entry was created
});

// Voice recordings table - stores audio files for mission logs
export const voiceRecordings = pgTable("voice_recordings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`), // Unique recording ID
  missionLogId: varchar("mission_log_id").notNull(), // Which mission log this belongs to
  audioData: text("audio_data").notNull(), // Audio file data (base64)
  duration: real("duration").notNull(), // Length in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(), // When recorded
});

// Form validation schemas - these check that data is correct before saving

// Schema for creating new users (only need username and password)
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Schema for creating new mood entries (excludes auto-generated fields)
export const insertMoodSchema = createInsertSchema(moods).omit({
  id: true, // Auto-generated
  userId: true, // Set by server
  date: true, // Auto-generated
});

// Schema for creating new mission logs (excludes auto-generated fields)
export const insertMissionLogSchema = createInsertSchema(missionLogs).omit({
  id: true, // Auto-generated
  userId: true, // Set by server
  createdAt: true, // Auto-generated
});

// Schema for creating new voice recordings (excludes auto-generated fields)
export const insertVoiceRecordingSchema = createInsertSchema(voiceRecordings).omit({
  id: true, // Auto-generated
  createdAt: true, // Auto-generated
});

// TypeScript types for the frontend to use

// Types for creating new records
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type InsertMissionLog = z.infer<typeof insertMissionLogSchema>;
export type InsertVoiceRecording = z.infer<typeof insertVoiceRecordingSchema>;

// Types for existing records (includes all fields)
export type User = typeof users.$inferSelect;
export type Mood = typeof moods.$inferSelect;
export type MissionLog = typeof missionLogs.$inferSelect;
export type VoiceRecording = typeof voiceRecordings.$inferSelect;
