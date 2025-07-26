import { useState } from "react";
import { Button } from "@/components/ui/button";

// Import planet SVGs
import sunSvg from "@/assets/planets/sun.svg";
import venusSvg from "@/assets/planets/venus.svg";
import earthSvg from "@/assets/planets/earth.svg";
import marsSvg from "@/assets/planets/mars.svg";
import jupiterSvg from "@/assets/planets/jupiter.svg";
import uranusSvg from "@/assets/planets/uranus.svg";
import neptuneSvg from "@/assets/planets/neptune.svg";
import mercurySvg from "@/assets/planets/mercury.svg";

export interface MoodOption {
  id: string;
  name: string;
  color: string;
  description: string;
  className: string;
}

const planetImages: Record<string, string> = {
  "happy": sunSvg,
  "love": venusSvg,
  "calm": earthSvg,
  "sad": neptuneSvg,
  "excited": marsSvg,
  "peaceful": uranusSvg,
  "energetic": jupiterSvg,
  "anxious": mercurySvg,
};

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
              className={`${planetSize} mx-auto rounded-full group-hover:scale-110 transition-all animate-float group-hover:animate-cyber-glow cursor-pointer overflow-hidden ${
                selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
              }`}
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <img 
                src={planetImages[mood.id]} 
                alt={mood.description}
                className="w-full h-full object-cover"
              />
            </div>
          </Button>
          <h4 className="font-semibold text-pink-300 font-serif">{mood.name}</h4>
          <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
        </div>
      ))}
    </div>
  );
}
