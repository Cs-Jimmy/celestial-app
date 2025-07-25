import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

interface VoiceRecorderProps {
  onRecordingComplete: (audioData: string, duration: number) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioURL,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useVoiceRecorder();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = () => {
    const result = stopRecording();
    if (result) {
      onRecordingComplete(result.audioData, result.duration);
    }
  };

  const togglePlayback = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-6">
      {/* Recording Button */}
      <div className="relative">
        <Button
          size="lg"
          variant="ghost"
          className={`w-32 h-32 rounded-full transition-all ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 animate-pulse" 
              : "bg-gradient-to-br from-red-500 to-red-600 hover:scale-110"
          }`}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/* Recording Info */}
      <div>
        <p className="text-lg font-semibold mb-2">
          {isRecording ? "Recording..." : "Voice Recording"}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {isRecording 
            ? "Click to stop recording your mission log" 
            : "Click to start recording your mission log"
          }
        </p>
      </div>

      {/* Recording Controls */}
      {isRecording && (
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={isPaused ? resumeRecording : pauseRecording}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      )}

      {/* Recording Time */}
      <div className="glass-panel p-4 rounded-lg">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm">Duration:</span>
          <span className="font-mono text-yellow-400 text-lg">
            {formatTime(recordingTime)}
          </span>
        </div>
      </div>

      {/* Playback Controls */}
      {audioURL && !isRecording && (
        <div className="glass-panel p-4 rounded-lg">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <span className="text-sm text-gray-400">Recording ready</span>
          </div>
        </div>
      )}
    </div>
  );
}
