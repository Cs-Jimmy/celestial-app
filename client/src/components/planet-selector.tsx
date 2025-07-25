import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface MoodOption {
  id: string;
  name: string;
  color: string;
  description: string;
  className: string;
}

interface PlanetSelectorProps {
  moods: MoodOption[];
  selectedMood?: string;
  onSelect: (mood: string) => void;
  size?: "small" | "large";
}

export function PlanetSelector({ moods, selectedMood, onSelect, size = "large" }: PlanetSelectorProps) {
  const planetSize = size === "large" ? "w-24 h-24" : "w-16 h-16";
  const gridCols = size === "large" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-8" : "grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {moods.map((mood, index) => (
        <div key={mood.id} className="text-center">
          <Button
            variant="ghost"
            className="group mb-4 p-0 h-auto bg-transparent hover:bg-transparent"
            onClick={() => onSelect(mood.id)}
          >
            <div 
              className={`${planetSize} mx-auto rounded-full planet-hologram ${mood.className} group-hover:scale-110 transition-all animate-float group-hover:animate-cyber-glow cursor-pointer ${
                selectedMood === mood.id ? "ring-4 ring-cyan-400" : ""
              }`}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          </Button>
          <h4 className="font-semibold text-cyan-300 font-mono">{mood.name}</h4>
          <p className="text-xs text-cyan-500 font-mono">{mood.description}</p>
        </div>
      ))}
    </div>
  );
}
