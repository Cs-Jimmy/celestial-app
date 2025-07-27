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

// Map mood IDs to their theme-matching emojis
const emotionEmojis: Record<string, string> = {
  "happy": "☀️", // Sun for happy
  "love": "💖", // Pink heart for love/Venus
  "calm": "🌊", // Ocean wave for calm/Earth
  "sad": "💧", // Water drop for sad/Neptune
  "excited": "🔥", // Fire for excited/Mars
  "peaceful": "✨", // Sparkles for peaceful/Uranus
  "energetic": "⚡", // Lightning for energetic/Jupiter
  "anxious": "🌪️", // Tornado for anxious/Mercury
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
              <div className="relative planet-container">
                <div 
                  className={`${planetSize} mx-auto rounded-full planet-hologram ${mood.className} animate-planet-static group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                    selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                  }`}
                />
                <div className="emotion-face">
                  {emotionEmojis[mood.id]}
                </div>
              </div>
            </Button>
            <h4 className="font-semibold text-pink-300 font-serif">{mood.name}</h4>
            <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
          </div>
        ))}
      </div>
    );
  }

  // Mood tracker layout - proper solar system with evenly distributed planets
  const planetsWithoutSun = moods.filter(mood => mood.id !== "happy");
  const sunMood = moods.find(mood => mood.id === "happy");
  
  // Define specific orbital positions for each planet with proper spacing and varied animations
  const solarSystemLayout: Record<string, { radius: number; angle: number; ringClass: string; animationDelay: number; animationType: string }> = {
    "happy": { radius: 0, angle: 0, ringClass: "", animationDelay: 0, animationType: "animate-sun-center" }, // Sun at center
    "love": { radius: 140, angle: 0, ringClass: "orbit-ring-mercury", animationDelay: 1.5, animationType: "animate-planet-float-gentle" }, // Venus (inner orbit)
    "calm": { radius: 220, angle: 60, ringClass: "orbit-ring-venus", animationDelay: 3, animationType: "animate-planet-float-orbital" }, // Earth
    "excited": { radius: 220, angle: 180, ringClass: "orbit-ring-venus", animationDelay: 4.5, animationType: "animate-planet-float-delayed" }, // Mars
    "energetic": { radius: 220, angle: 300, ringClass: "orbit-ring-venus", animationDelay: 6, animationType: "animate-planet-float-delayed" }, // Jupiter (3 planets evenly spaced)
    "peaceful": { radius: 300, angle: 90, ringClass: "orbit-ring-earth", animationDelay: 7.5, animationType: "animate-planet-float-gentle" }, // Uranus
    "sad": { radius: 300, angle: 210, ringClass: "orbit-ring-earth", animationDelay: 9, animationType: "animate-planet-float-orbital" }, // Neptune
    "anxious": { radius: 300, angle: 330, ringClass: "orbit-ring-earth", animationDelay: 0, animationType: "animate-planet-float-delayed" }, // Mercury moved to furthest orbit
  };
  
  const planetOrbitData: Record<string, { radius: number; angle: number; ringClass: string; animationDelay: number; animationType: string }> = {};
  
  // Assign predefined positions or distribute remaining planets
  moods.forEach((mood, index) => {
    if (solarSystemLayout[mood.id]) {
      planetOrbitData[mood.id] = solarSystemLayout[mood.id];
    } else {
      // Fallback for any extra planets
      const radius = 300;
      const angle = index * (360 / moods.length);
      const animationTypes = ["animate-planet-float-delayed", "animate-planet-float-orbital", "animate-planet-float-gentle"];
      planetOrbitData[mood.id] = { 
        radius, 
        angle, 
        ringClass: "orbit-ring-earth", 
        animationDelay: index * 1.5,
        animationType: animationTypes[index % animationTypes.length]
      };
    }
  });

  return (
    <div className="relative flex items-center justify-center min-h-[750px]">
      {/* Orbital container */}
      <div className="relative w-[750px] h-[750px]">
        {/* Orbital rings - show only the ones we're using */}
        <div className="orbit-ring orbit-ring-mercury"></div>
        <div className="orbit-ring orbit-ring-venus"></div>
        <div className="orbit-ring orbit-ring-earth"></div>

        {/* Planets positioned around the sun */}
        {moods.map((mood) => {
          const orbitData = planetOrbitData[mood.id] || { radius: 0, angle: 0, ringClass: "", animationDelay: 0, animationType: "animate-planet-float-delayed" };
          const isSun = mood.id === "happy";
          const animationClass = orbitData.animationType;
          
          // Sun stays larger, orbital planets are smaller for realistic scale
          const planetDisplaySize = isSun ? planetSize : (size === "large" ? "w-16 h-16" : "w-12 h-12");
          
          if (isSun) {
            // Sun stays at center with original size
            return (
              <div 
                key={mood.id} 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="group mb-2 p-0 h-auto bg-transparent hover:bg-transparent"
                    onClick={() => onSelect(mood.id)}
                  >
                    <div className="relative planet-container">
                      <div 
                        className={`${planetDisplaySize} mx-auto rounded-full planet-hologram ${mood.className} ${animationClass} group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                          selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                        }`}
                      />
                      <div className="emotion-face">
                        {emotionEmojis[mood.id]}
                      </div>
                    </div>
                  </Button>
                  <h4 className="font-semibold text-pink-300 font-serif text-xs">{mood.name}</h4>
                  <p className="text-xs text-pink-400 font-serif italic">{mood.description}</p>
                </div>
              </div>
            );
          }
          
          // Orbital planets - smaller size with staggered floating animations
          return (
            <div 
              key={mood.id} 
              className="absolute top-1/2 left-1/2"
              style={{ 
                transform: `rotate(${orbitData.angle}deg) translateX(${orbitData.radius}px) rotate(-${orbitData.angle}deg) translate(-50%, -50%)`
              }}
            >
              <div className="text-center">
                {/* Planet button */}
                <Button
                  variant="ghost"
                  className="group mb-2 p-0 h-auto bg-transparent hover:bg-transparent"
                  onClick={() => onSelect(mood.id)}
                >
                  <div className="relative planet-container">
                    {/* Smaller orbital planets with staggered floating animation */}
                    <div 
                      className={`${planetDisplaySize} mx-auto rounded-full planet-hologram ${mood.className} ${animationClass} group-hover:scale-110 transition-all group-hover:animate-cyber-glow cursor-pointer ${
                        selectedMood === mood.id ? "ring-4 ring-pink-400" : ""
                      }`}
                      style={{
                        animationDelay: `${orbitData.animationDelay}s`
                      }}
                    />
                    <div className="emotion-face">
                      {emotionEmojis[mood.id]}
                    </div>
                  </div>
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
