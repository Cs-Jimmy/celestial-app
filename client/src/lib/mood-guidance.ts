export interface MoodGuidance {
  tip: string;
  activity: string;
  color: string;
}

export const moodGuidanceData: Record<string, MoodGuidance> = {
  "happy": {
    tip: "☀️ Like the Sun's radiant warmth, your golden energy illuminates everything around you!",
    activity: "Share your bright energy - celebrate achievements, create something beautiful, or brighten someone's day with your warmth.",
    color: "text-yellow-300"
  },
  "love": {
    tip: "💕 Venus blesses you with soft pink energy of affection and beauty!",
    activity: "Express your heart through art, write love letters, have meaningful conversations, or create something that celebrates connection.",
    color: "text-pink-400"
  },
  "calm": {
    tip: "🌍 Like Earth's steady presence, your blue energy brings balance and nurturing peace.",
    activity: "Ground yourself in nature, practice mindful breathing, organize your space, or engage in gentle self-care rituals.",
    color: "text-blue-300"
  },
  "sad": {
    tip: "🌊 Neptune's deep blue waters invite you to flow with your emotions and find healing.",
    activity: "Honor your feelings through journaling, take a soothing bath, listen to music, or seek comfort from loved ones.",
    color: "text-blue-400"
  },
  "excited": {
    tip: "💜 Mars channels vibrant violet energy of passion, drive, and creative fire!",
    activity: "Channel this electric energy into action - dance, create, start new projects, or share your enthusiasm with others.",
    color: "text-violet-400"
  },
  "peaceful": {
    tip: "🌌 Uranus gifts you with serene cyan energy of wisdom and spiritual connection.",
    activity: "Meditate under the stars, practice gratitude, spend quiet time in nature, or explore your inner wisdom through reflection.",
    color: "text-cyan-300"
  },
  "energetic": {
    tip: "🪐 Jupiter's expansive beige energy fuels your motivation and ambitious spirit!",
    activity: "Take on new challenges, organize and tackle your goals, exercise with purpose, or expand your horizons through learning.",
    color: "text-amber-300"
  },
  "anxious": {
    tip: "☿️ Mercury's gentle silver energy reminds you to slow down and find your center.",
    activity: "Practice deep breathing exercises, create a calm environment, do gentle stretches, or engage in soothing repetitive activities.",
    color: "text-gray-300"
  }
};

export function getMoodGuidance(mood: string): MoodGuidance {
  return moodGuidanceData[mood] || moodGuidanceData["calm"];
}
