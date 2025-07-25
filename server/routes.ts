import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodSchema, insertMissionLogSchema, insertVoiceRecordingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Mock user ID for demo purposes (in real app, this would come from authentication)
  const DEMO_USER_ID = "demo-user-123";

  // Mood routes
  app.get("/api/moods", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let moods;
      
      if (startDate && endDate) {
        moods = await storage.getMoodsByUserIdAndDateRange(
          DEMO_USER_ID,
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        moods = await storage.getMoodsByUserId(DEMO_USER_ID);
      }
      
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch moods" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const validatedData = insertMoodSchema.parse(req.body);
      const mood = await storage.createMood(validatedData, DEMO_USER_ID);
      res.status(201).json(mood);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood data" });
    }
  });

  app.delete("/api/moods/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMood(id, DEMO_USER_ID);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Mood not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mood" });
    }
  });

  // Mission Log routes
  app.get("/api/mission-logs", async (req, res) => {
    try {
      const missionLogs = await storage.getMissionLogsByUserId(DEMO_USER_ID);
      res.json(missionLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission logs" });
    }
  });

  app.get("/api/mission-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const missionLog = await storage.getMissionLogById(id, DEMO_USER_ID);
      if (missionLog) {
        res.json(missionLog);
      } else {
        res.status(404).json({ message: "Mission log not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mission log" });
    }
  });

  app.post("/api/mission-logs", async (req, res) => {
    try {
      const validatedData = insertMissionLogSchema.parse(req.body);
      const missionLog = await storage.createMissionLog(validatedData, DEMO_USER_ID);
      res.status(201).json(missionLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid mission log data" });
    }
  });

  app.patch("/api/mission-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertMissionLogSchema.partial().parse(req.body);
      const missionLog = await storage.updateMissionLog(id, updates, DEMO_USER_ID);
      if (missionLog) {
        res.json(missionLog);
      } else {
        res.status(404).json({ message: "Mission log not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/mission-logs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMissionLog(id, DEMO_USER_ID);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Mission log not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mission log" });
    }
  });

  // Voice Recording routes
  app.get("/api/voice-recordings/:missionLogId", async (req, res) => {
    try {
      const { missionLogId } = req.params;
      const recordings = await storage.getVoiceRecordingsByMissionLogId(missionLogId);
      res.json(recordings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch voice recordings" });
    }
  });

  app.post("/api/voice-recordings", async (req, res) => {
    try {
      const validatedData = insertVoiceRecordingSchema.parse(req.body);
      const recording = await storage.createVoiceRecording(validatedData);
      res.status(201).json(recording);
    } catch (error) {
      res.status(400).json({ message: "Invalid voice recording data" });
    }
  });

  app.delete("/api/voice-recordings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVoiceRecording(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Voice recording not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete voice recording" });
    }
  });

  // Analytics route
  app.get("/api/analytics", async (req, res) => {
    try {
      const moods = await storage.getMoodsByUserId(DEMO_USER_ID);
      const missionLogs = await storage.getMissionLogsByUserId(DEMO_USER_ID);
      
      // Calculate analytics
      const moodCounts = moods.reduce((acc, mood) => {
        acc[mood.mood] = (acc[mood.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const totalMoods = moods.length;
      const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
        mood,
        count,
        percentage: totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0
      }));
      
      const averageMood = totalMoods > 0 ? 
        moods.reduce((sum, mood) => sum + mood.intensity, 0) / totalMoods : 0;
      
      // Calculate streak (consecutive days with mood entries)
      const today = new Date();
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dayHasMood = moods.some(mood => {
          const moodDate = new Date(mood.date);
          return moodDate.toDateString() === checkDate.toDateString();
        });
        if (dayHasMood) {
          streak++;
        } else if (i > 0) {
          break;
        }
      }
      
      const analytics = {
        totalEntries: totalMoods,
        totalMissionLogs: missionLogs.length,
        streak,
        averageMood: Math.round(averageMood * 10) / 10,
        moodDistribution,
        predominantMood: moodDistribution.length > 0 ? 
          moodDistribution.sort((a, b) => b.count - a.count)[0].mood : null
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate analytics" });
    }
  });

  return httpServer;
}
