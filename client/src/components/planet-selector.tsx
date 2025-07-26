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

  // Mood tracker layout - orbital system with planets distributed in circles around sun
  const planetsWithoutSun = moods.filter(mood => mood.id !== "happy");
  const sunMood = moods.find(mood => mood.id === "happy");
  
  // Create concentric circles of planets around the sun
  const orbitRadii = [130, 200, 270]; // Three orbital distances
  const planetsPerOrbit = Math.ceil(planetsWithoutSun.length / orbitRadii.length);
  
  const planetOrbitData: Record<string, { radius: number; angle: number; ringClass: string }> = {};
  
  // Place sun at center
  if (sunMood) {
    planetOrbitData[sunMood.id] = { radius: 0, angle: 0, ringClass: "" };
  }
  
  // Distribute remaining planets in circular orbits
  planetsWithoutSun.forEach((mood, index) => {
    const orbitIndex = Math.floor(index / planetsPerOrbit);
    const positionInOrbit = index % planetsPerOrbit;
    const planetsInThisOrbit = Math.min(planetsPerOrbit, planetsWithoutSun.length - orbitIndex * planetsPerOrbit);
    
    const radius = orbitRadii[orbitIndex] || orbitRadii[orbitRadii.length - 1];
    const angleStep = 360 / planetsInThisOrbit;
    const angle = positionInOrbit * angleStep;
    
    // Map to appropriate ring class based on radius
    let ringClass = "";
    if (radius <= 130) ringClass = "orbit-ring-mercury";
    else if (radius <= 200) ringClass = "orbit-ring-venus"; 
    else ringClass = "orbit-ring-earth";
    
    planetOrbitData[mood.id] = { radius, angle, ringClass };
  });

  return (
    <div className="relative flex items-center justify-center min-h-[700px]">
      {/* Orbital container */}
      <div className="relative w-[700px] h-[700px]">
        {/* Orbital rings - show only the ones we're using */}
        <div className="orbit-ring orbit-ring-mercury"></div>
        <div className="orbit-ring orbit-ring-venus"></div>
        <div className="orbit-ring orbit-ring-earth"></div>

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
