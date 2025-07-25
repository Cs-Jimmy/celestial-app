import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetSelector, type MoodOption } from "@/components/planet-selector";
import { Flame, BookOpen, Smile } from "lucide-react";
import type { Mood, MissionLog } from "@shared/schema";

const quickMoodOptions: MoodOption[] = [
  { id: "joy", name: "Joyful", color: "yellow", description: "Golden Planet", className: "mood-joy" },
  { id: "calm", name: "Calm", color: "blue", description: "Azure World", className: "mood-calm" },
  { id: "energy", name: "Energetic", color: "red", description: "Crimson Core", className: "mood-energy" },
  { id: "love", name: "Loving", color: "pink", description: "Rose Nebula", className: "mood-love" },
];

interface Analytics {
  totalEntries: number;
  totalMissionLogs: number;
  streak: number;
  averageMood: number;
  predominantMood: string | null;
}

export default function Dashboard() {
  const { data: moods } = useQuery<Mood[]>({
    queryKey: ["/api/moods"],
  });

  const { data: missionLogs } = useQuery<MissionLog[]>({
    queryKey: ["/api/mission-logs"],
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  const recentLogs = missionLogs?.slice(0, 3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Welcome back, Space Explorer</h2>
        <p className="text-xl text-gray-300 mb-8">Ready for today's emotional journey?</p>
        
        {/* Quick Mood Check */}
        <div className="glass-panel rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-6">How are you feeling today?</h3>
          <div className="max-w-4xl mx-auto">
            <PlanetSelector
              moods={quickMoodOptions}
              onSelect={(mood) => {
                // Navigate to mood tracker with selected mood
                window.location.href = `/mood-tracker?mood=${mood}`;
              }}
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-panel border-white/10 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {analytics?.streak || 0}
            </div>
            <div className="text-gray-300">Day Streak</div>
            <div className="mt-2">
              <Flame className="h-6 w-6 text-orange-500 mx-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {analytics?.totalEntries || 0}
            </div>
            <div className="text-gray-300">Total Entries</div>
            <div className="mt-2">
              <BookOpen className="h-6 w-6 text-blue-400 mx-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {analytics?.predominantMood || "N/A"}
            </div>
            <div className="text-gray-300">This Week's Vibe</div>
            <div className="mt-2">
              <Smile className="h-6 w-6 text-green-400 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-panel border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Recent Mission Logs</h3>
            <Link href="/mission-log">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          {recentLogs.length > 0 ? (
            <div className="space-y-4">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {log.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {log.content ? 
                        `${log.content.substring(0, 60)}...` : 
                        "Voice recording"
                      }
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mission logs yet. Start your journey!</p>
              <Link href="/mission-log">
                <Button className="mt-4" variant="outline">
                  Create First Log
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
