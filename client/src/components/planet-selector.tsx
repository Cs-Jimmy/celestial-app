// Planet selector component - displays mood options as clickable planets
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Import planet SVG images for each mood
import sunSvg from "@/assets/planets/sun.svg";
import venusSvg from "@/assets/planets/venus.svg";
import earthSvg from "@/assets/planets/earth.svg";
import marsSvg from "@/assets/planets/mars.svg";
import jupiterSvg from "@/assets/planets/jupiter.svg";
import uranusSvg from "@/assets/planets/uranus.svg";
import neptuneSvg from "@/assets/planets/neptune.svg";
import mercurySvg from "@/assets/planets/mercury.svg";

// Type definition for mood options
export interface MoodOption {
  id: string; // Unique identifier (e.g., "happy", "sad")
  name: string; // Display name (e.g., "Happy")
  color: string; // Color theme
  description: string; // Planet name (e.g., "Sun", "Earth")
  className: string; // CSS class for styling
}

// Map mood IDs to their planet images
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

// Props for the PlanetSelector component
interface PlanetSelectorProps {
  moods: MoodOption[]; // Array of mood options to display
  selectedMood?: string; // Currently selected mood ID
  onSelect: (mood: string) => void; // Function called when user clicks a planet
  size?: "small" | "large"; // Size variant for different contexts
}

// Main planet selector component
export function PlanetSelector({ moods, selectedMood, onSelect, size = "large" }: PlanetSelectorProps) {
  // Set planet size based on variant
  const planetSize = size === "large" ? "w-24 h-24" : "w-16 h-16";
  // Set grid layout based on variant
  const gridCols = size === "large" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-8" : "grid-cols-2 md:grid-cols-4";

  // Map planet IDs to their orbital animation classes
  const orbitalAnimations: Record<string, string> = {
    "happy": "animate-sun-center", // Sun at center
    "anxious": "animate-orbit-mercury", // Mercury - closest, fastest
    "love": "animate-orbit-venus", // Venus
    "calm": "animate-orbit-earth", // Earth
    "excited": "animate-orbit-mars", // Mars
    "energetic": "animate-orbit-jupiter", // Jupiter
    "peaceful": "animate-orbit-uranus", // Uranus
    "sad": "animate-orbit-neptune", // Neptune - farthest, slowest
  };

  return (
    <div className="relative flex items-center justify-center min-h-[600px]">
      {/* Orbital container */}
      <div className="relative w-[600px] h-[600px]">
        {moods.map((mood) => {
          const orbitalClass = orbitalAnimations[mood.id] || "animate-sun-center";
          const isSun = mood.id === "happy";
          
          return (
            <div 
              key={mood.id} 
              className={`absolute ${isSun ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"}`}
            >
              {/* Planet orbit container */}
              <div className={orbitalClass}>
                <div className="text-center">
                  {/* Planet button */}
                  <Button
                    variant="ghost"
                    className="group mb-2 p-0 h-auto bg-transparent hover:bg-transparent"
                    onClick={() => onSelect(mood.id)}
                  >
                    {/* Planet visual */}
                    <div 
                      className={`${planetSize} mx-auto rounded-full planet-hologram ${mood.className} group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                        selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                      }`}
                    />
                  </Button>
                  {/* Planet labels */}
                  <h4 className="font-semibold text-pink-300 font-serif text-xs">{mood.name}</h4>
                  <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
