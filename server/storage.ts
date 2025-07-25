import { type User, type InsertUser, type Mood, type InsertMood, type MissionLog, type InsertMissionLog, type VoiceRecording, type InsertVoiceRecording } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood methods
  getMoodsByUserId(userId: string): Promise<Mood[]>;
  getMoodsByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Mood[]>;
  createMood(mood: InsertMood, userId: string): Promise<Mood>;
  deleteMood(id: string, userId: string): Promise<boolean>;
  
  // Mission Log methods
  getMissionLogsByUserId(userId: string): Promise<MissionLog[]>;
  getMissionLogById(id: string, userId: string): Promise<MissionLog | undefined>;
  createMissionLog(missionLog: InsertMissionLog, userId: string): Promise<MissionLog>;
  updateMissionLog(id: string, missionLog: Partial<InsertMissionLog>, userId: string): Promise<MissionLog | undefined>;
  deleteMissionLog(id: string, userId: string): Promise<boolean>;
  
  // Voice Recording methods
  getVoiceRecordingsByMissionLogId(missionLogId: string): Promise<VoiceRecording[]>;
  createVoiceRecording(voiceRecording: InsertVoiceRecording): Promise<VoiceRecording>;
  deleteVoiceRecording(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moods: Map<string, Mood>;
  private missionLogs: Map<string, MissionLog>;
  private voiceRecordings: Map<string, VoiceRecording>;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.missionLogs = new Map();
    this.voiceRecordings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMoodsByUserId(userId: string): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => mood.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getMoodsByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => 
        mood.userId === userId && 
        new Date(mood.date) >= startDate && 
        new Date(mood.date) <= endDate
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createMood(insertMood: InsertMood, userId: string): Promise<Mood> {
    const id = randomUUID();
    const mood: Mood = { 
      ...insertMood, 
      id, 
      userId, 
      date: new Date() 
    };
    this.moods.set(id, mood);
    return mood;
  }

  async deleteMood(id: string, userId: string): Promise<boolean> {
    const mood = this.moods.get(id);
    if (mood && mood.userId === userId) {
      this.moods.delete(id);
      return true;
    }
    return false;
  }

  async getMissionLogsByUserId(userId: string): Promise<MissionLog[]> {
    return Array.from(this.missionLogs.values())
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMissionLogById(id: string, userId: string): Promise<MissionLog | undefined> {
    const log = this.missionLogs.get(id);
    return log && log.userId === userId ? log : undefined;
  }

  async createMissionLog(insertMissionLog: InsertMissionLog, userId: string): Promise<MissionLog> {
    const id = randomUUID();
    const missionLog: MissionLog = { 
      ...insertMissionLog, 
      id, 
      userId, 
      createdAt: new Date() 
    };
    this.missionLogs.set(id, missionLog);
    return missionLog;
  }

  async updateMissionLog(id: string, updates: Partial<InsertMissionLog>, userId: string): Promise<MissionLog | undefined> {
    const missionLog = this.missionLogs.get(id);
    if (missionLog && missionLog.userId === userId) {
      const updated = { ...missionLog, ...updates };
      this.missionLogs.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteMissionLog(id: string, userId: string): Promise<boolean> {
    const log = this.missionLogs.get(id);
    if (log && log.userId === userId) {
      this.missionLogs.delete(id);
      return true;
    }
    return false;
  }

  async getVoiceRecordingsByMissionLogId(missionLogId: string): Promise<VoiceRecording[]> {
    return Array.from(this.voiceRecordings.values())
      .filter(recording => recording.missionLogId === missionLogId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createVoiceRecording(insertVoiceRecording: InsertVoiceRecording): Promise<VoiceRecording> {
    const id = randomUUID();
    const voiceRecording: VoiceRecording = { 
      ...insertVoiceRecording, 
      id, 
      createdAt: new Date() 
    };
    this.voiceRecordings.set(id, voiceRecording);
    return voiceRecording;
  }

  async deleteVoiceRecording(id: string): Promise<boolean> {
    return this.voiceRecordings.delete(id);
  }
}

export const storage = new MemStorage();
