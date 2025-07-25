import { useState, useRef, useCallback } from "react";

interface RecordingResult {
  audioData: string;
  duration: number;
}

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now() - recordingTime * 1000;
    timerRef.current = setInterval(() => {
      setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, [recordingTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }, [startTimer]);

  const stopRecording = useCallback((): RecordingResult | null => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();

      // Convert audio blob to base64 for storage
      if (audioChunksRef.current.length > 0) {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const reader = new FileReader();
        
        return new Promise<RecordingResult>((resolve) => {
          reader.onloadend = () => {
            const audioData = reader.result as string;
            resolve({
              audioData,
              duration: recordingTime,
            });
          };
          reader.readAsDataURL(audioBlob);
        }) as any; // TypeScript workaround for Promise handling
      }
    }
    return null;
  }, [isRecording, recordingTime, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  }, [isRecording, stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  }, [isRecording, isPaused, startTimer]);

  const resetRecording = useCallback(() => {
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setAudioURL(null);
    audioChunksRef.current = [];
  }, [stopTimer]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioURL,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
}
