import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Target, Rocket } from "lucide-react";

interface Analytics {
  totalEntries: number;
  totalMissionLogs: number;
  streak: number;
  averageMood: number;
  moodDistribution: Array<{
    mood: string;
    count: number;
    percentage: number;
  }>;
  predominantMood: string | null;
}

const moodColors: Record<string, string> = {
  "happy": "bg-yellow-300",
  "love": "bg-pink-400", 
  "calm": "bg-emerald-300",
  "sad": "bg-purple-300",
  "excited": "bg-violet-400",
  "peaceful": "bg-cyan-300",
  "energetic": "bg-orange-300",
  "anxious": "bg-rose-300",
};

const moodLabels: Record<string, string> = {
  "happy": "Happy",
  "love": "Love",
  "calm": "Calm",
  "sad": "Sad",
  "excited": "Excited",
  "peaceful": "Peaceful",
  "energetic": "Energetic",
  "anxious": "Anxious",
};

export default function Analytics() {
  const { data: analytics, isLoading } = useQuery<Analytics>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Mission Analytics</h2>
          <p className="text-gray-300">No data available yet. Start tracking your moods to see analytics!</p>
        </div>
      </div>
    );
  }

  const consistencyScore = analytics.totalEntries > 0 ? Math.min(100, (analytics.streak / 7) * 100) : 0;
  const growthTrajectory = analytics.averageMood > 0 ? (analytics.averageMood / 10) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-serif">✨ cosmic insights ✨</h2>
        <p className="text-pink-300 font-serif italic">&gt; reading your celestial energy patterns...</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mood Distribution */}
        <Card className="cyber-panel border-cyan-500/50">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-cyan-300 font-mono">EXOPLANET_DISTRIBUTION.DAT</h3>
            <div className="space-y-4">
              {analytics.moodDistribution.map((stat) => (
                <div key={stat.mood} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${moodColors[stat.mood] || "bg-gray-400"}`}></div>
                    <span>{moodLabels[stat.mood] || stat.mood}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Progress 
                      value={stat.percentage} 
                      className="w-32"
                    />
                    <span className="text-sm font-mono w-12">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card className="cyber-panel border-cyan-500/50">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-cyan-300 font-mono">ORBITAL_PATTERNS.LOG</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Mood</span>
                  <span className="font-mono">{analytics.averageMood.toFixed(1)}/10</span>
                </div>
                <Progress value={growthTrajectory} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Consistency Score</span>
                  <span className="font-mono">{consistencyScore.toFixed(0)}/100</span>
                </div>
                <Progress value={consistencyScore} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Streak</span>
                  <span className="font-mono">{analytics.streak} days</span>
                </div>
                <Progress value={Math.min(100, (analytics.streak / 30) * 100)} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Insights */}
        <Card className="cyber-panel border-cyan-500/50 lg:col-span-2">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-cyan-300 font-mono">MISSION_INTELLIGENCE.SYS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-lg font-semibold mb-2">Peak Performance</div>
                <div className="text-sm text-gray-400">
                  {analytics.predominantMood ? 
                    `Your ${moodLabels[analytics.predominantMood] || analytics.predominantMood} energy dominates this period` :
                    "Track more moods to see patterns"
                  }
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-lg font-semibold mb-2">Focus Zone</div>
                <div className="text-sm text-gray-400">
                  {analytics.totalEntries > 0 ?
                    "You're building healthy tracking habits" :
                    "Start tracking to unlock insights"
                  }
                </div>
              </div>
              <div className="bg-white/5 p-6 rounded-lg text-center">
                <Rocket className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-lg font-semibold mb-2">Growth Area</div>
                <div className="text-sm text-gray-400">
                  {analytics.totalMissionLogs > 0 ?
                    "Your mission logs enhance mood awareness" :
                    "Try adding mission logs for deeper insights"
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
