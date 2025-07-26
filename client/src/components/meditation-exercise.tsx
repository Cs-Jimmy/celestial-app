import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Heart, Wind } from "lucide-react";

interface MeditationExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  breathingPattern: {
    inhale: number;
    hold: number;
    exhale: number;
    pause?: number;
  };
  guidance: string[];
  icon: React.ComponentType<any>;
}

interface MeditationExerciseProps {
  mood: string;
  onComplete?: () => void;
}

const meditationExercises: Record<string, MeditationExercise[]> = {
  happy: [
    {
      id: "gratitude-breath",
      name: "Gratitude Breathing",
      description: "Amplify your joy with grateful breaths",
      duration: 300, // 5 minutes
      breathingPattern: { inhale: 4, hold: 2, exhale: 4 },
      guidance: [
        "Sit comfortably and close your eyes",
        "Think of something you're grateful for",
        "Breathe in joy and appreciation",
        "Hold that feeling of gratitude",
        "Exhale with a smile"
      ],
      icon: Heart
    }
  ],
  love: [
    {
      id: "loving-kindness",
      name: "Loving-Kindness Meditation",
      description: "Send love to yourself and others",
      duration: 480, // 8 minutes
      breathingPattern: { inhale: 4, hold: 1, exhale: 6 },
      guidance: [
        "Place your hand on your heart",
        "Breathe in love for yourself",
        "Hold that self-compassion",
        "Exhale love to someone special",
        "Continue spreading love with each breath"
      ],
      icon: Heart
    }
  ],
  calm: [
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "Maintain your peaceful state",
      duration: 420, // 7 minutes
      breathingPattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      guidance: [
        "Imagine drawing a square with your breath",
        "Breathe in for the first side",
        "Hold for the second side",
        "Exhale for the third side",
        "Pause for the fourth side"
      ],
      icon: Wind
    }
  ],
  sad: [
    {
      id: "comfort-breathing",
      name: "Comfort Breathing",
      description: "Gentle breathing to ease sadness",
      duration: 360, // 6 minutes
      breathingPattern: { inhale: 3, hold: 1, exhale: 5 },
      guidance: [
        "Find a comfortable position",
        "Breathe in gentleness and compassion",
        "Allow yourself to feel",
        "Exhale tension and heaviness",
        "Let each breath bring comfort"
      ],
      icon: Heart
    }
  ],
  excited: [
    {
      id: "grounding-breath",
      name: "Grounding Breath",
      description: "Channel your excitement mindfully",
      duration: 240, // 4 minutes
      breathingPattern: { inhale: 3, hold: 2, exhale: 4 },
      guidance: [
        "Feel your feet on the ground",
        "Breathe in your excitement",
        "Hold that energy",
        "Exhale with intention and focus",
        "Ground your energy with each breath"
      ],
      icon: Wind
    }
  ],
  peaceful: [
    {
      id: "serenity-meditation",
      name: "Serenity Meditation",
      description: "Deepen your sense of peace",
      duration: 600, // 10 minutes
      breathingPattern: { inhale: 5, hold: 2, exhale: 7 },
      guidance: [
        "Close your eyes gently",
        "Breathe in tranquility",
        "Hold that peaceful feeling",
        "Exhale any remaining tension",
        "Sink deeper into serenity"
      ],
      icon: Heart
    }
  ],
  energetic: [
    {
      id: "focus-breathing",
      name: "Energizing Focus Breath",
      description: "Channel your energy productively",
      duration: 180, // 3 minutes
      breathingPattern: { inhale: 2, hold: 1, exhale: 3 },
      guidance: [
        "Sit up straight with purpose",
        "Take quick, energizing breaths",
        "Feel your vitality",
        "Exhale with intention",
        "Direct your energy mindfully"
      ],
      icon: Wind
    }
  ],
  anxious: [
    {
      id: "calming-breath",
      name: "4-7-8 Calming Breath",
      description: "Soothe anxiety with structured breathing",
      duration: 300, // 5 minutes
      breathingPattern: { inhale: 4, hold: 7, exhale: 8 },
      guidance: [
        "Place your tongue behind your upper teeth",
        "Breathe in quietly through your nose",
        "Hold your breath and count",
        "Exhale completely through your mouth",
        "Feel anxiety melting away"
      ],
      icon: Wind
    }
  ]
};

export function MeditationExercise({ mood, onComplete }: MeditationExerciseProps) {
  const [selectedExercise, setSelectedExercise] = useState<MeditationExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [currentGuidanceIndex, setCurrentGuidanceIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeRef = useRef(0);
  const totalTimeRef = useRef(0);

  const exercises = meditationExercises[mood] || [];

  useEffect(() => {
    if (exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(exercises[0]);
      setTimeRemaining(exercises[0].duration);
    }
  }, [exercises, selectedExercise]);

  useEffect(() => {
    if (isActive && selectedExercise) {
      intervalRef.current = setInterval(() => {
        phaseTimeRef.current += 0.1;
        totalTimeRef.current += 0.1;
        
        const pattern = selectedExercise.breathingPattern;
        let phaseDuration = 0;
        let nextPhase: typeof currentPhase = 'inhale';
        
        switch (currentPhase) {
          case 'inhale':
            phaseDuration = pattern.inhale;
            nextPhase = 'hold';
            break;
          case 'hold':
            phaseDuration = pattern.hold;
            nextPhase = 'exhale';
            break;
          case 'exhale':
            phaseDuration = pattern.exhale;
            nextPhase = pattern.pause ? 'pause' : 'inhale';
            break;
          case 'pause':
            phaseDuration = pattern.pause || 0;
            nextPhase = 'inhale';
            break;
        }
        
        const progress = (phaseTimeRef.current / phaseDuration) * 100;
        setPhaseProgress(Math.min(progress, 100));
        
        if (phaseTimeRef.current >= phaseDuration) {
          setCurrentPhase(nextPhase);
          phaseTimeRef.current = 0;
          
          // Update guidance periodically
          if (Math.random() < 0.3) {
            setCurrentGuidanceIndex(prev => 
              (prev + 1) % selectedExercise.guidance.length
            );
          }
        }
        
        const totalProgressPercent = (totalTimeRef.current / selectedExercise.duration) * 100;
        setTotalProgress(Math.min(totalProgressPercent, 100));
        setTimeRemaining(Math.max(0, selectedExercise.duration - totalTimeRef.current));
        
        if (totalTimeRef.current >= selectedExercise.duration) {
          handleComplete();
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setTotalProgress(0);
    setCurrentGuidanceIndex(0);
    phaseTimeRef.current = 0;
    totalTimeRef.current = 0;
    if (selectedExercise) {
      setTimeRemaining(selectedExercise.duration);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-cyan-300';
      case 'hold': return 'text-purple-300';
      case 'exhale': return 'text-pink-300';
      case 'pause': return 'text-yellow-300';
      default: return 'text-white';
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'pause': return 'Pause...';
    }
  };

  if (exercises.length === 0) {
    return (
      <Card className="cyber-panel border-pink-500/50">
        <CardContent className="p-6 text-center">
          <p className="text-pink-300 font-serif">No meditation exercises available for this mood yet. ✨</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exercise Selection */}
      {!isActive && totalProgress === 0 && (
        <div className="grid gap-4">
          {exercises.map((exercise) => {
            const IconComponent = exercise.icon;
            return (
              <Card 
                key={exercise.id}
                className={`cyber-panel cursor-pointer transition-all hover:border-pink-400/70 ${
                  selectedExercise?.id === exercise.id ? 'border-pink-400/70 bg-pink-500/10' : 'border-pink-500/50'
                }`}
                onClick={() => {
                  setSelectedExercise(exercise);
                  setTimeRemaining(exercise.duration);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-6 w-6 text-pink-400" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-pink-300 font-serif">{exercise.name}</h3>
                      <p className="text-sm text-pink-400/80 font-serif italic">{exercise.description}</p>
                      <p className="text-xs text-pink-500 mt-1">Duration: {formatTime(exercise.duration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Active Exercise */}
      {selectedExercise && (
        <Card className="cyber-panel border-pink-500/50">
          <CardHeader className="text-center">
            <CardTitle className="text-pink-300 font-serif flex items-center justify-center space-x-2">
              <selectedExercise.icon className="h-5 w-5" />
              <span>{selectedExercise.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Breathing Circle */}
            <div className="flex justify-center">
              <div className="relative">
                <div 
                  className={`w-32 h-32 rounded-full border-4 transition-all duration-1000 ${
                    currentPhase === 'inhale' ? 'scale-110 border-cyan-400' :
                    currentPhase === 'hold' ? 'scale-110 border-purple-400' :
                    currentPhase === 'exhale' ? 'scale-90 border-pink-400' :
                    'scale-100 border-yellow-400'
                  } cyber-panel flex items-center justify-center`}
                >
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getPhaseColor()} font-serif`}>
                      {getPhaseInstruction()}
                    </div>
                    <div className="text-sm text-pink-400 mt-1">
                      {Math.ceil((selectedExercise.breathingPattern[currentPhase as keyof typeof selectedExercise.breathingPattern] || 0) - (phaseTimeRef.current))}s
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-pink-300">
                <span>Phase Progress</span>
                <span>{Math.round(phaseProgress)}%</span>
              </div>
              <Progress value={phaseProgress} className="h-2" />
              
              <div className="flex justify-between text-sm text-pink-300">
                <span>Total Progress</span>
                <span>{formatTime(timeRemaining)} remaining</span>
              </div>
              <Progress value={totalProgress} className="h-2" />
            </div>

            {/* Guidance */}
            <div className="text-center">
              <p className="text-pink-300 font-serif italic">
                {selectedExercise.guidance[currentGuidanceIndex]}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isActive ? (
                <Button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {totalProgress > 0 ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  variant="outline"
                  className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-pink-500/50 text-pink-300 hover:bg-pink-500/20"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}