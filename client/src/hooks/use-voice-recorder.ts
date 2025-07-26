// Voice recorder hook - handles audio recording for mission logs
import { useState, useRef, useCallback } from "react";

// What we get back when recording is finished
interface RecordingResult {
  audioData: string; // Audio file as base64 string for storage
  duration: number; // How long the recording is in seconds
}

// Main voice recorder hook
export function useVoiceRecorder() {
  // Recording state
  const [isRecording, setIsRecording] = useState(false); // Is currently recording
  const [isPaused, setIsPaused] = useState(false); // Is recording paused
  const [recordingTime, setRecordingTime] = useState(0); // Seconds recorded so far
  const [audioURL, setAudioURL] = useState<string | null>(null); // URL to play back recording

  // Browser APIs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Browser recording interface
  const audioChunksRef = useRef<Blob[]>([]); // Audio data pieces
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer to track recording time
  const startTimeRef = useRef<number>(0); // When recording started

  // Start counting recording time
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now() - recordingTime * 1000;
    timerRef.current = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, [recordingTime]);

  // Stop counting recording time
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start recording audio from microphone
  const startRecording = useCallback(async () => {
    try {
      // Ask browser for microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Save audio data as it's recorded
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, create playback URL
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Release microphone access
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }, [startTimer]);

  // Stop recording and return audio data for saving
  const stopRecording = useCallback((onComplete?: (result: RecordingResult) => void): Promise<RecordingResult | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        // Set up the stop handler before stopping
        const originalOnStop = mediaRecorderRef.current.onstop;
        mediaRecorderRef.current.onstop = () => {
          // Call original stop handler first
          if (originalOnStop) {
            originalOnStop.call(mediaRecorderRef.current, new Event('stop'));
          }
          
          // Convert audio to text format for database storage
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            const reader = new FileReader();
            
            reader.onloadend = () => {
              const audioData = reader.result as string; // Base64 audio data
              const result = {
                audioData,
                duration: recordingTime,
              };
              if (onComplete) onComplete(result);
              resolve(result);
            };
            reader.readAsDataURL(audioBlob); // Convert to base64
          } else {
            resolve(null);
          }
        };

        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsPaused(false);
        stopTimer();
      } else {
        resolve(null);
      }
    });
  }, [isRecording, recordingTime, stopTimer]);

  // Pause recording (can be resumed later)
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [isRecording, stopTimer]);

  // Resume paused recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [isRecording, isPaused, startTimer]);

  // Clear everything and start over
  const resetRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioURL(null);
    audioChunksRef.current = [];
  }, [stopTimer]);

  // Return all functions and state for components to use
  return {
    isRecording, // True when actively recording
    isPaused, // True when recording is paused
    recordingTime, // Seconds recorded so far
    audioURL, // URL to play back the recording
    startRecording, // Function to start recording
    stopRecording, // Function to stop and get audio data
    pauseRecording, // Function to pause recording
    resumeRecording, // Function to resume recording
    resetRecording, // Function to clear everything
  };
}
