import { useEffect, useState } from 'react';

interface CelestialObject {
  id: string;
  type: 'rocket' | 'meteor' | 'comet';
  startDelay: number;
  animationDuration: number;
  startPosition: { x: number; y: number };
}

export function CelestialBackground() {
  const [objects, setObjects] = useState<CelestialObject[]>([]);

  useEffect(() => {
    // Create celestial objects with randomized properties
    const createCelestialObjects = () => {
      const newObjects: CelestialObject[] = [];
      
      // Create 2-3 rockets
      for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        newObjects.push({
          id: `rocket-${i}`,
          type: 'rocket',
          startDelay: Math.random() * 20000, // 0-20s delay
          animationDuration: 25000 + Math.random() * 10000, // 25-35s duration
          startPosition: {
            x: -100,
            y: Math.random() * window.innerHeight
          }
        });
      }

      // Create 3-5 meteors
      for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
        newObjects.push({
          id: `meteor-${i}`,
          type: 'meteor',
          startDelay: Math.random() * 15000, // 0-15s delay
          animationDuration: 8000 + Math.random() * 4000, // 8-12s duration
          startPosition: {
            x: window.innerWidth + 100,
            y: -50
          }
        });
      }

      // Create 1-2 comets
      for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
        newObjects.push({
          id: `comet-${i}`,
          type: 'comet',
          startDelay: Math.random() * 30000, // 0-30s delay
          animationDuration: 30000 + Math.random() * 15000, // 30-45s duration
          startPosition: {
            x: -100,
            y: Math.random() * window.innerHeight * 0.5 + window.innerHeight * 0.25 // Middle 50% of screen
          }
        });
      }

      return newObjects;
    };

    // Initialize objects
    setObjects(createCelestialObjects());

    // Recreate objects periodically to maintain continuous movement
    const interval = setInterval(() => {
      setObjects(createCelestialObjects());
    }, 45000); // Refresh every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const getAnimationClass = (type: string) => {
    switch (type) {
      case 'rocket':
        return 'animate-rocket-diagonal';
      case 'meteor':
        return 'animate-meteor-fast';
      case 'comet':
        return 'animate-comet-curved';
      default:
        return '';
    }
  };

  const getAnimationStyle = (obj: CelestialObject) => {
    return {
      animationDelay: `${obj.startDelay}ms`,
      animationDuration: `${obj.animationDuration}ms`,
      left: `${obj.startPosition.x}px`,
      top: `${obj.startPosition.y}px`,
    };
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`celestial-object ${obj.type} ${getAnimationClass(obj.type)}`}
          style={getAnimationStyle(obj)}
        />
      ))}
    </div>
  );
}