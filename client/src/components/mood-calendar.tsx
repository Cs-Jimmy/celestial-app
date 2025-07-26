import { useMemo } from "react";
import type { Mood } from "@shared/schema";

interface MoodCalendarProps {
  moods: Mood[];
  onDateSelect?: (date: Date) => void;
}

const moodColors: Record<string, string> = {
  "happy": "bg-yellow-300",
  "love": "bg-pink-400", 
  "calm": "bg-emerald-300",
  "sad": "bg-purple-300",
  "excited": "bg-violet-400",
  "peaceful": "bg-cyan-300",
  "energetic": "bg-orange-300",
  "anxious": "bg-rose-300",
};

export function MoodCalendar({ moods, onDateSelect }: MoodCalendarProps) {
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const moodsByDate = moods.reduce((acc, mood) => {
      const date = new Date(mood.date).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(mood);
      return acc;
    }, {} as Record<string, Mood[]>);

    return { daysInMonth, firstDay, moodsByDate };
  }, [moods]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-panel rounded-xl p-8">
      <h3 className="text-xl font-semibold mb-6">Your Emotional Journey</h3>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: calendarData.firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {/* Days of month */}
        {Array.from({ length: calendarData.daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date();
          date.setDate(day);
          const dateString = date.toDateString();
          const dayMoods = calendarData.moodsByDate[dateString] || [];
          const primaryMood = dayMoods[0];

          return (
            <button
              key={day}
              onClick={() => onDateSelect?.(date)}
              className="p-2 text-center text-sm border border-white/10 rounded-lg relative cursor-pointer hover:bg-white/5 transition-colors"
            >
              <span>{day}</span>
              {primaryMood && (
                <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${moodColors[primaryMood.mood] || "bg-gray-400"}`} />
              )}
              {dayMoods.length > 1 && (
                <div className="absolute bottom-1 left-1 text-xs text-yellow-400">
                  {dayMoods.length}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
