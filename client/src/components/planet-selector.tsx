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

  // Check if this is being used in the mood tracker page (size === "large")
  const isMoodTracker = size === "large";

  if (!isMoodTracker) {
    // Dashboard layout - planets in a line
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
                className={`${planetSize} mx-auto rounded-full planet-hologram ${mood.className} animate-planet-static group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                  selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                }`}
              />
            </Button>
            <h4 className="font-semibold text-pink-300 font-serif">{mood.name}</h4>
            <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
          </div>
        ))}
      </div>
    );
  }

  // Mood tracker layout - orbital system
  // Calculate planet positions using proper angles on their orbits
  const planetOrbitData: Record<string, { radius: number; angle: number; ringClass: string }> = {
    "happy": { radius: 0, angle: 0, ringClass: "" }, // Sun at center
    "anxious": { radius: 110, angle: 0, ringClass: "orbit-ring-mercury" }, // Mercury - 0° (right)
    "love": { radius: 150, angle: 315, ringClass: "orbit-ring-venus" }, // Venus - 315° (top-right)
    "calm": { radius: 190, angle: 270, ringClass: "orbit-ring-earth" }, // Earth - 270° (top)
    "excited": { radius: 230, angle: 45, ringClass: "orbit-ring-mars" }, // Mars - 45° (bottom-right)
    "energetic": { radius: 270, angle: 180, ringClass: "orbit-ring-jupiter" }, // Jupiter - 180° (left)
    "peaceful": { radius: 310, angle: 225, ringClass: "orbit-ring-uranus" }, // Uranus - 225° (top-left)
    "sad": { radius: 350, angle: 135, ringClass: "orbit-ring-neptune" }, // Neptune - 135° (bottom-left)
  };

  return (
    <div className="relative flex items-center justify-center min-h-[800px]">
      {/* Orbital container */}
      <div className="relative w-[800px] h-[800px]">
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
          const orbitData = planetOrbitData[mood.id] || { radius: 0, angle: 0, ringClass: "" };
          const isSun = mood.id === "happy";
          const animationClass = isSun ? "animate-sun-center" : "animate-planet-static";
          
          // Calculate x, y position using trigonometry
          const angleRad = (orbitData.angle * Math.PI) / 180;
          const x = orbitData.radius * Math.cos(angleRad);
          const y = orbitData.radius * Math.sin(angleRad);
          
          return (
            <div 
              key={mood.id} 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                transform: `translate(${x}px, ${y}px)`
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
