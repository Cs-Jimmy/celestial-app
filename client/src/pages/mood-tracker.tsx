import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { PlanetSelector, type MoodOption } from "@/components/planet-selector";
import { MoodCalendar } from "@/components/mood-calendar";
import { MeditationExercise } from "@/components/meditation-exercise";
import { getMoodGuidance } from "@/lib/mood-guidance";
import { generateStardate } from "@/lib/stardate";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Lightbulb, Music, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Mood } from "@shared/schema";

const allMoodOptions: MoodOption[] = [
  { id: "happy", name: "Happy", color: "yellow", description: "Sun", className: "planet-sun" },
  { id: "love", name: "Love", color: "pink", description: "Venus", className: "planet-venus" },
  { id: "calm", name: "Calm", color: "blue", description: "Earth", className: "planet-earth" },
  { id: "sad", name: "Sad", color: "blue", description: "Neptune", className: "planet-neptune" },
  { id: "excited", name: "Excited", color: "violet", description: "Mars", className: "planet-mars" },
  { id: "peaceful", name: "Peaceful", color: "cyan", description: "Uranus", className: "planet-uranus" },
  { id: "energetic", name: "Energetic", color: "orange", description: "Jupiter", className: "planet-jupiter" },
  { id: "anxious", name: "Anxious", color: "gray", description: "Mercury", className: "planet-mercury" },
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-serif">mood tracker</h2>
        <p className="text-pink-300 font-serif italic">&gt; choose how you're feeling today...</p>
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

      {/* Meditation Exercise */}
      {selectedMood && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-serif">meditation & breathing exercises</h3>
          <MeditationExercise mood={selectedMood} />
        </div>
      )}

      {/* Mood Calendar */}
      <MoodCalendar moods={moods || []} />
    </div>
  );
}
