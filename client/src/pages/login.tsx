import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, Star, Zap, Monitor } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("EXPLORER");
  const [rememberMe, setRememberMe] = useState(false);
  const [enableSounds, setEnableSounds] = useState(true);

  const profiles = ["EXPLORER", "COSMIC", "STELLAR"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md retro-terminal border-2 border-[#4ea8de] bg-slate-900/95 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-cyber-glow flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-[#E4D9FF] mb-2 font-mono tracking-wider retro-text">
                CELESTIAL
              </h1>
              <p className="text-[#4ea8de] text-sm font-mono uppercase tracking-wider">
                MOOD TRACKING SYSTEM v2.1
              </p>
            </div>

            {/* Profile Selection */}
            <div className="mb-6">
              <label className="block text-[#E4D9FF] text-xs font-mono uppercase tracking-wider mb-2">
                PROFILE TYPE
              </label>
              <div className="relative">
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-[#4ea8de] text-[#E4D9FF] px-4 py-3 font-mono text-sm uppercase tracking-wider appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
                >
                  {profiles.map((profile) => (
                    <option key={profile} value={profile} className="bg-slate-800">
                      {profile}
                    </option>
                  ))}
                </select>
                <Monitor className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4ea8de] pointer-events-none" />
              </div>
            </div>

            {/* Username Input */}
            <div className="mb-4">
              <label className="block text-[#E4D9FF] text-xs font-mono uppercase tracking-wider mb-2">
                USERNAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4ea8de]" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ENTER_USERNAME"
                  className="bg-slate-800 border-2 border-[#4ea8de] text-[#E4D9FF] pl-10 py-3 font-mono text-sm placeholder-slate-500 uppercase tracking-wider hover:bg-slate-700 focus:bg-slate-700 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-[#E4D9FF] text-xs font-mono uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4ea8de]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-slate-800 border-2 border-[#4ea8de] text-[#E4D9FF] pl-10 py-3 font-mono text-sm placeholder-slate-500 tracking-wider hover:bg-slate-700 focus:bg-slate-700 transition-colors"
                />
              </div>
            </div>

            {/* Options */}
            <div className="mb-6 space-y-3">
              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[#E4D9FF] text-xs font-mono uppercase tracking-wider">
                  REMEMBER LOGIN
                </span>
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative w-12 h-6 border-2 border-[#4ea8de] transition-colors ${
                    rememberMe ? 'bg-[#4ea8de]' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-[#E4D9FF] transition-transform ${
                      rememberMe ? 'translate-x-6' : 'translate-x-0'
                    } top-0.5 left-0.5`}
                  />
                </button>
              </div>

              {/* Enable Sounds Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-[#E4D9FF] text-xs font-mono uppercase tracking-wider">
                  ENABLE SOUNDS
                </span>
                <button
                  onClick={() => setEnableSounds(!enableSounds)}
                  className={`relative w-12 h-6 border-2 border-[#4ea8de] transition-colors ${
                    enableSounds ? 'bg-[#4ea8de]' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-[#E4D9FF] transition-transform ${
                      enableSounds ? 'translate-x-6' : 'translate-x-0'
                    } top-0.5 left-0.5`}
                  />
                </button>
              </div>
            </div>

            {/* Login Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-mono uppercase tracking-wider py-3 border-2 border-[#4ea8de] transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  // Handle login logic here
                  console.log("Login attempt:", { username, selectedProfile, rememberMe, enableSounds });
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                INITIALIZE SESSION
              </Button>

              <Button
                variant="outline"
                className="w-full bg-slate-800 border-2 border-[#4ea8de] text-[#4ea8de] hover:bg-[#4ea8de] hover:text-slate-900 font-mono uppercase tracking-wider py-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  // Handle guest access
                  console.log("Guest access");
                }}
              >
                GUEST ACCESS
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">
                © 2025 CELESTIAL SYSTEMS
              </p>
              <p className="text-xs text-slate-600 font-mono mt-1">
                MOOD.TRACKING.PROTOCOL.ACTIVE
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}