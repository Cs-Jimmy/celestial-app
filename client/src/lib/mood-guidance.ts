export interface MoodGuidance {
  tip: string;
  activity: string;
  color: string;
}

export const moodGuidanceData: Record<string, MoodGuidance> = {
  "pegasi-b": {
    tip: "Channel this euphoric energy into creative breakthroughs and positive connections.",
    activity: "Share your joy with others, start a new project, or celebrate recent achievements.",
    color: "text-yellow-400"
  },
  "proxima-b": {
    tip: "Harness this passionate intensity for meaningful pursuits and deep connections.",
    activity: "Express yourself through art, have meaningful conversations, or pursue romantic interests.",
    color: "text-red-400"
  },
  "kepler-452b": {
    tip: "Use this balanced state for making important decisions and establishing healthy routines.",
    activity: "Plan your goals, practice mindfulness, or engage in moderate physical activity.",
    color: "text-green-400"
  },
  "trappist-1e": {
    tip: "Embrace this serenity for deep reflection and inner peace cultivation.",
    activity: "Meditate, read inspiring content, or spend quiet time in nature.",
    color: "text-blue-400"
  },
  "kepler-186f": {
    tip: "Tap into this mystical energy for spiritual exploration and intuitive insights.",
    activity: "Practice yoga, explore philosophical ideas, or engage in creative visualization.",
    color: "text-purple-400"
  },
  "hd-209458b": {
    tip: "Use this transcendent state for breakthrough thinking and elevated perspectives.",
    activity: "Brainstorm innovative solutions, practice gratitude, or engage in learning new concepts.",
    color: "text-cyan-400"
  },
  "gliese-667cc": {
    tip: "Channel this energetic drive into productive activities and physical challenges.",
    activity: "Exercise, tackle challenging tasks, or organize your environment for optimal flow.",
    color: "text-orange-400"
  },
  "psr-b1257": {
    tip: "Honor this contemplative mood for deep thinking and introspective work.",
    activity: "Journal your thoughts, reflect on life lessons, or engage in philosophical discussions.",
    color: "text-gray-400"
  }
};

export function getMoodGuidance(mood: string): MoodGuidance {
  return moodGuidanceData[mood] || moodGuidanceData["trappist-1e"];
}
