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

  // Planet positions around the sun (stationary)
  const planetPositions: Record<string, { x: number; y: number; ringClass?: string }> = {
    "happy": { x: 0, y: 0 }, // Sun at center
    "anxious": { x: 80, y: 0, ringClass: "orbit-ring-mercury" }, // Mercury - right
    "love": { x: -110, y: 0, ringClass: "orbit-ring-venus" }, // Venus - left
    "calm": { x: 0, y: -140, ringClass: "orbit-ring-earth" }, // Earth - top
    "excited": { x: 0, y: 170, ringClass: "orbit-ring-mars" }, // Mars - bottom
    "energetic": { x: 142, y: 142, ringClass: "orbit-ring-jupiter" }, // Jupiter - bottom right
    "peaceful": { x: -163, y: -163, ringClass: "orbit-ring-uranus" }, // Uranus - top left
    "sad": { x: -184, y: 184, ringClass: "orbit-ring-neptune" }, // Neptune - bottom left
  };

  return (
    <div className="relative flex items-center justify-center min-h-[600px]">
      {/* Orbital container */}
      <div className="relative w-[600px] h-[600px]">
        {/* Orbital rings */}
        <div className="orbit-ring orbit-ring-mercury"></div>
        <div className="orbit-ring orbit-ring-venus"></div>
        <div className="orbit-ring orbit-ring-earth"></div>
        <div className="orbit-ring orbit-ring-mars"></div>
        <div className="orbit-ring orbit-ring-jupiter"></div>
        <div className="orbit-ring orbit-ring-uranus"></div>
        <div className="orbit-ring orbit-ring-neptune"></div>

        {/* Planets positioned around the sun */}
        {moods.map((mood) => {
          const position = planetPositions[mood.id] || { x: 0, y: 0 };
          const isSun = mood.id === "happy";
          const animationClass = isSun ? "animate-sun-center" : "animate-planet-static";
          
          return (
            <div 
              key={mood.id} 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                transform: `translate(${position.x - 48}px, ${position.y - 48}px)` // Offset by half planet size
              }}
            >
              <div className="text-center">
                {/* Planet button */}
                <Button
                  variant="ghost"
                  className="group mb-2 p-0 h-auto bg-transparent hover:bg-transparent"
                  onClick={() => onSelect(mood.id)}
                >
                  {/* Planet visual */}
                  <div 
                    className={`${planetSize} mx-auto rounded-full planet-hologram ${mood.className} ${animationClass} group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                      selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                    }`}
                  />
                </Button>
                {/* Planet labels */}
                <h4 className="font-semibold text-pink-300 font-serif text-xs">{mood.name}</h4>
                <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
