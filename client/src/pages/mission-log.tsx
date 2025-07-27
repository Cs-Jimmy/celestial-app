import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { VoiceRecorder } from "@/components/voice-recorder";
import { MissionLogEntry } from "@/components/mission-log-entry";
import { generateStardate } from "@/lib/stardate";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Keyboard, Mic, Save, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { MissionLog } from "@shared/schema";

export default function MissionLogPage() {
  const [entryType, setEntryType] = useState<"text" | "voice">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [audioData, setAudioData] = useState<string>("");
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const { toast } = useToast();

  const { data: missionLogs } = useQuery<MissionLog[]>({
    queryKey: ["/api/mission-logs"],
  });

  const createLogMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content?: string;
      status: string;
      entryType: string;
      audioData?: string;
      audioDuration?: number;
      stardate: string;
    }) => {
      const response = await apiRequest("POST", "/api/mission-logs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission-logs"] });
      toast({
        title: "Mission log saved! 📝",
        description: "Your entry has been added to the database.",
      });
      // Reset form
      setTitle("");
      setContent("");
      setStatus("ongoing");
      setAudioData("");
      setAudioDuration(0);
    },
    onError: () => {
      toast({
        title: "Failed to save mission log",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MissionLog> }) => {
      const response = await apiRequest("PATCH", `/api/mission-logs/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission-logs"] });
      toast({
        title: "Mission log updated",
        description: "Your changes have been saved.",
      });
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/mission-logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mission-logs"] });
      toast({
        title: "Mission log deleted",
        description: "The entry has been removed from the database.",
      });
    },
  });

  const handleSaveEntry = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your mission log.",
        variant: "destructive",
      });
      return;
    }

    if (entryType === "text" && !content.trim()) {
      toast({
        title: "Content required",
        description: "Please write some content for your mission log.",
        variant: "destructive",
      });
      return;
    }

    if (entryType === "voice" && !audioData) {
      toast({
        title: "Recording required",
        description: "Please record audio for your voice log.",
        variant: "destructive",
      });
      return;
    }

    createLogMutation.mutate({
      title,
      content: entryType === "text" ? content : undefined,
      status,
      entryType,
      audioData: entryType === "voice" ? audioData : undefined,
      audioDuration: entryType === "voice" ? audioDuration : undefined,
      stardate: generateStardate(),
    });
  };

  const handleRecordingComplete = (audioDataUrl: string, duration: number) => {
    setAudioData(audioDataUrl);
    setAudioDuration(duration);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-serif">mission log database</h2>
        <p className="text-pink-300 font-serif italic">&gt; Record your thoughts, experiences, and discoveries</p>
      </div>

      {/* New Entry Panel */}
      <Card className="glass-panel border-white/10 mb-8">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6">New Mission Log Entry</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Stardate</label>
                <Input
                  value={generateStardate()}
                  readOnly
                  className="bg-white/10 border-white/20 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mission Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-white/10 border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="challenging">Challenging</SelectItem>
                    <SelectItem value="breakthrough">Breakthrough</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mission log title..."
                  className="bg-white/10 border-white/20 focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Entry Type</label>
                <div className="flex space-x-4">
                  <Button
                    variant={entryType === "text" ? "default" : "outline"}
                    onClick={() => setEntryType("text")}
                    className="flex-1"
                  >
                    <Keyboard className="mr-2 h-4 w-4" />
                    Text Entry
                  </Button>
                  <Button
                    variant={entryType === "voice" ? "default" : "outline"}
                    onClick={() => setEntryType("voice")}
                    className="flex-1"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Voice Log
                  </Button>
                </div>
              </div>
            </div>
            <div>
              {entryType === "text" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Log Entry</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="h-64 bg-white/10 border-white/20 focus:border-yellow-400 font-mono text-sm"
                    placeholder={`Stardate ${generateStardate()} - Begin log entry...

Today's observations and reflections...`}
                  />
                </div>
              ) : (
                <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
              )}

              <Button
                onClick={handleSaveEntry}
                disabled={createLogMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              >
                <Save className="mr-2 h-4 w-4" />
                {createLogMutation.isPending ? "Saving..." : "Save to Database"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Entries */}
      <Card className="glass-panel border-white/10">
        <CardContent className="p-8">
          <h3 className="text-xl font-semibold mb-6">Previous Mission Logs</h3>
          {missionLogs && missionLogs.length > 0 ? (
            <div className="space-y-6">
              {missionLogs.map((log) => (
                <MissionLogEntry
                  key={log.id}
                  entry={log}
                  onEdit={(id, updates) => updateLogMutation.mutate({ id, updates })}
                  onDelete={(id) => deleteLogMutation.mutate(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mission logs recorded yet.</p>
              <p className="text-sm">Start documenting your journey above!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
