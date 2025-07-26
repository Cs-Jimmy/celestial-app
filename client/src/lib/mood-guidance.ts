export interface MoodGuidance {
  tip: string;
  activity: string;
  color: string;
}

export const moodGuidanceData: Record<string, MoodGuidance> = {
  "happy": {
    tip: "✨ Channel this golden energy into spreading joy and celebrating your wins!",
    activity: "Treat yourself to something beautiful, call your besties, or start that creative project you've been dreaming about.",
    color: "text-yellow-300"
  },
  "love": {
    tip: "💖 This warm pink energy is perfect for deep connections and self-expression!",
    activity: "Write in your journal, create art that speaks to your soul, or have that heart-to-heart conversation.",
    color: "text-pink-400"
  },
  "calm": {
    tip: "🌿 Your balanced mint energy is ideal for nurturing yourself and making mindful choices.",
    activity: "Practice gentle self-care, organize your sacred space, or take a peaceful nature walk.",
    color: "text-emerald-300"
  },
  "sad": {
    tip: "💜 Honor this soft blue energy with gentle self-compassion and healing.",
    activity: "Take a warm bath, journal your feelings, or reach out to someone who cares about you.",
    color: "text-purple-300"
  },
  "excited": {
    tip: "🔮 Channel this vibrant violet energy into positive action and creative expression!",
    activity: "Dance to your favorite music, start a new project, or share your excitement with friends.",
    color: "text-violet-400"
  },
  "peaceful": {
    tip: "✨ This serene blue energy is perfect for deep reflection and spiritual connection!",
    activity: "Meditate, practice gratitude, or spend quiet time in nature connecting with your inner wisdom.",
    color: "text-cyan-300"
  },
  "energetic": {
    tip: "🧡 Channel this vibrant peachy energy into movement and joyful productivity!",
    activity: "Try a new workout, clean your space with intention, or tackle that project you've been putting off.",
    color: "text-orange-300"
  },
  "anxious": {
    tip: "🌸 Honor this tender rose energy with extra gentleness and grounding practices.",
    activity: "Practice deep breathing, do some gentle stretching, or create a calming environment around yourself.",
    color: "text-rose-300"
  }
};

export function getMoodGuidance(mood: string): MoodGuidance {
  return moodGuidanceData[mood] || moodGuidanceData["calm"];
}
