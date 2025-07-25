export interface MoodGuidance {
  tip: string;
  activity: string;
  color: string;
}

export const moodGuidanceData: Record<string, MoodGuidance> = {
  "pegasi-b": {
    tip: "✨ Channel this golden goddess energy into manifesting your dreams and celebrating your wins!",
    activity: "Treat yourself to something beautiful, call your besties, or start that creative project you've been dreaming about.",
    color: "text-yellow-300"
  },
  "proxima-b": {
    tip: "💖 This passionate pink energy is perfect for deep connections and self-expression!",
    activity: "Write in your journal, create art that speaks to your soul, or have that heart-to-heart conversation.",
    color: "text-pink-400"
  },
  "kepler-452b": {
    tip: "🌿 Your balanced mint energy is ideal for nurturing yourself and making mindful choices.",
    activity: "Practice gentle self-care, organize your sacred space, or take a peaceful nature walk.",
    color: "text-emerald-300"
  },
  "trappist-1e": {
    tip: "💜 Embrace this dreamy lavender energy for spiritual connection and inner wisdom.",
    activity: "Meditate with crystals, read something inspiring, or practice gratitude rituals.",
    color: "text-purple-300"
  },
  "kepler-186f": {
    tip: "🔮 Tap into this mystical violet energy for intuitive insights and magical thinking.",
    activity: "Pull some oracle cards, practice manifestation, or explore your spiritual interests.",
    color: "text-violet-400"
  },
  "hd-209458b": {
    tip: "✨ This electric blue energy is perfect for breakthrough moments and divine inspiration!",
    activity: "Vision board, brainstorm your goals, or dive into learning something that excites you.",
    color: "text-cyan-300"
  },
  "gliese-667cc": {
    tip: "🧡 Channel this warm peachy energy into movement and joyful productivity!",
    activity: "Dance to your favorite music, clean your space with intention, or try a new workout.",
    color: "text-orange-300"
  },
  "psr-b1257": {
    tip: "🌸 Honor this soft rose energy for gentle reflection and self-compassion.",
    activity: "Take a warm bath, journal your feelings, or have a cozy night of self-reflection.",
    color: "text-rose-300"
  }
};

export function getMoodGuidance(mood: string): MoodGuidance {
  return moodGuidanceData[mood] || moodGuidanceData["trappist-1e"];
}
