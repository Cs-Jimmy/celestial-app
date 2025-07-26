import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetSelector, type MoodOption } from "@/components/planet-selector";
import { Flame, BookOpen, Smile } from "lucide-react";
import type { Mood, MissionLog } from "@shared/schema";

const quickMoodOptions: MoodOption[] = [
  { id: "happy", name: "Happy", color: "yellow", description: "Sun", className: "planet-sun" },
  { id: "love", name: "Love", color: "pink", description: "Venus", className: "planet-venus" },
  { id: "calm", name: "Calm", color: "blue", description: "Earth", className: "planet-earth" },
  { id: "sad", name: "Sad", color: "blue", description: "Neptune", className: "planet-neptune" },
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">WELCOME BACK, EXPLORER ✨</h2>
        <p className="text-xl text-pink-300 mb-8 font-serif italic">&gt; scanning your cosmic energy signature...</p>
        
        {/* Quick Mood Check */}
        <div className="cyber-panel rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-pink-300 font-serif italic">&gt; choose your planetary vibe ♡</h3>
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
        <Card className="dark-universe-panel border-blue-400/50 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300 mb-2 font-mono">
              {analytics?.streak || 0}
            </div>
            <div className="text-royal-blue font-serif font-bold cosmic-glow">cosmic streak</div>
            <div className="mt-2">
              <Flame className="h-6 w-6 text-pink-400 mx-auto" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-universe-panel border-blue-400/50 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300 mb-2 font-mono">
              {analytics?.totalEntries || 0}
            </div>
            <div className="text-royal-blue font-serif font-bold cosmic-glow">total entries</div>
          </CardContent>
        </Card>

        <Card className="dark-universe-panel border-blue-400/50 text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-300 mb-2 font-mono">
              {analytics?.predominantMood || "NULL"}
            </div>
            <div className="text-royal-blue font-serif font-bold cosmic-glow">prime vibe</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="dark-universe-panel border-blue-400/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-royal-blue font-serif font-bold cosmic-glow">recent mission logs</h3>
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
                  className="flex items-center space-x-4 p-4 bg-transparent rounded-lg"
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
