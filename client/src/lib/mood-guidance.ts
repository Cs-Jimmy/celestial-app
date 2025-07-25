export interface MoodGuidance {
  tip: string;
  activity: string;
  color: string;
}

export const moodGuidanceData: Record<string, MoodGuidance> = {
  joy: {
    tip: "Embrace this joyful energy by sharing it with others or working on creative projects.",
    activity: "Try listening to upbeat music or taking a walk in nature to amplify positive feelings.",
    color: "text-yellow-400"
  },
  calm: {
    tip: "Use this peaceful state for reflection, meditation, or planning important decisions.",
    activity: "Consider reading, gentle stretching, or practicing mindfulness exercises.",
    color: "text-blue-400"
  },
  energy: {
    tip: "Channel this energy into physical activities or tackling challenging tasks.",
    activity: "Go for a run, clean your space, or work on that project you've been putting off.",
    color: "text-red-400"
  },
  love: {
    tip: "Share this loving feeling with people important to you or practice self-compassion.",
    activity: "Reach out to a friend, write a gratitude list, or do something kind for yourself.",
    color: "text-pink-400"
  },
  peace: {
    tip: "Cherish this tranquil moment and use it for restoration and inner work.",
    activity: "Try meditation, gentle yoga, or spend time in nature.",
    color: "text-green-400"
  },
  creative: {
    tip: "Harness this creative spark for artistic expression or problem-solving.",
    activity: "Write, draw, brainstorm new ideas, or work on a creative project.",
    color: "text-purple-400"
  },
  focused: {
    tip: "Make the most of this mental clarity by tackling important or complex tasks.",
    activity: "Work on challenging projects, organize your space, or learn something new.",
    color: "text-orange-400"
  },
  sad: {
    tip: "Honor these feelings while being gentle with yourself and seeking support if needed.",
    activity: "Journal your thoughts, talk to a friend, or engage in comforting self-care.",
    color: "text-gray-400"
  }
};

export function getMoodGuidance(mood: string): MoodGuidance {
  return moodGuidanceData[mood] || moodGuidanceData.calm;
}
