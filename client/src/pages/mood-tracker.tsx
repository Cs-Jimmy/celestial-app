import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetSelector, type MoodOption } from "@/components/planet-selector";
import { MoodCalendar } from "@/components/mood-calendar";
import { getMoodGuidance } from "@/lib/mood-guidance";
import { generateStardate } from "@/lib/stardate";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Lightbulb, Music, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Mood } from "@shared/schema";

const allMoodOptions: MoodOption[] = [
  { id: "pegasi-b", name: "Euphoric", color: "yellow", description: "51 Pegasi b", className: "planet-pegasi-b" },
  { id: "proxima-b", name: "Passionate", color: "red", description: "Proxima Centauri b", className: "planet-proxima-b" },
  { id: "kepler-452b", name: "Balanced", color: "green", description: "Kepler-452b", className: "planet-kepler-452b" },
  { id: "trappist-1e", name: "Serene", color: "blue", description: "TRAPPIST-1e", className: "planet-trappist-1e" },
  { id: "kepler-186f", name: "Mystical", color: "purple", description: "Kepler-186f", className: "planet-kepler-186f" },
  { id: "hd-209458b", name: "Transcendent", color: "cyan", description: "HD 209458 b", className: "planet-hd-209458b" },
  { id: "gliese-667cc", name: "Energetic", color: "orange", description: "Gliese 667Cc", className: "planet-gliese-667cc" },
  { id: "psr-b1257", name: "Contemplative", color: "gray", description: "PSR B1257+12 b", className: "planet-psr-b1257" },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [intensity, setIntensity] = useState([5]);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const { data: moods } = useQuery<Mood[]>({
    queryKey: ["/api/moods"],
  });

  const saveMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; intensity: number; note: string; stardate: string }) => {
      const response = await apiRequest("POST", "/api/moods", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Mood logged successfully! 🌟",
        description: "Your emotional state has been recorded in the cosmic database.",
      });
      // Reset form
      setSelectedMood("");
      setIntensity([5]);
      setNote("");
    },
    onError: () => {
      toast({
        title: "Failed to log mood",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check URL for pre-selected mood
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const moodParam = urlParams.get("mood");
    if (moodParam && allMoodOptions.find(m => m.id === moodParam)) {
      setSelectedMood(moodParam);
    }
  }, []);

  const handleSaveMood = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose a planet that represents your current emotional state.",
        variant: "destructive",
      });
      return;
    }

    saveMoodMutation.mutate({
      mood: selectedMood,
      intensity: intensity[0],
      note,
      stardate: generateStardate(),
    });
  };

  const selectedMoodOption = allMoodOptions.find(m => m.id === selectedMood);
  const guidance = selectedMood ? getMoodGuidance(selectedMood) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400 font-mono">EXOPLANET.MOOD_SYSTEM</h2>
        <p className="text-cyan-300 font-mono">&gt; SELECT TARGET EXOPLANET FOR EMOTIONAL_MAPPING</p>
      </div>

      {/* Planet Selection Grid */}
      <div className="mb-12">
        <PlanetSelector
          moods={allMoodOptions}
          selectedMood={selectedMood}
          onSelect={setSelectedMood}
        />
      </div>

      {/* Mood Details Panel */}
      {selectedMood && (
        <Card className="glass-panel border-white/10 mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Selected Mood: <span className="text-yellow-400">{selectedMoodOption?.name}</span>
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Intensity Level</label>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Mild</span>
                      <span className="text-yellow-400">{intensity[0]}/10</span>
                      <span>Intense</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Quick Note (Optional)</label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="bg-white/10 border-white/20 focus:border-yellow-400"
                      rows={3}
                      placeholder="What's contributing to this feeling?"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Guidance for Today</h4>
                {guidance && (
                  <div className="space-y-3">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                        <span className="font-medium">Tip</span>
                      </div>
                      <p className="text-sm text-gray-300">{guidance.tip}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Music className="h-5 w-5 text-pink-400 mr-2" />
                        <span className="font-medium">Activity</span>
                      </div>
                      <p className="text-sm text-gray-300">{guidance.activity}</p>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleSaveMood}
                  disabled={!selectedMood || saveMoodMutation.isPending}
                  className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-black font-semibold"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveMoodMutation.isPending ? "Logging..." : "Log This Mood"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Calendar */}
      <MoodCalendar moods={moods || []} />
    </div>
  );
}
