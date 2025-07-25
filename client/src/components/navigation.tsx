import { Link, useLocation } from "wouter";
import { Home, Globe, BookOpen, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/mood-tracker", label: "Mood Tracker", icon: Globe },
    { path: "/mission-log", label: "Mission Log", icon: BookOpen },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      <nav className="relative z-50 cyber-panel border-b border-cyan-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-magenta-500 rounded-full animate-cyber-glow border-2 border-cyan-400"></div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">CELESTIAL</h1>
              <span className="text-xs bg-gradient-to-r from-cyan-500 to-magenta-500 px-2 py-1 rounded-full text-black font-bold">SYSTEM.EXE</span>
            </div>
            <div className="flex items-center space-x-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} href={path}>
                  <Button
                    variant="ghost"
                    className={`px-4 py-2 rounded-lg transition-all hover:bg-cyan-500/20 border border-transparent hover:border-cyan-500/50 ${
                      location === path ? "bg-cyan-500/20 border-cyan-500/50" : ""
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link href="/mood-tracker">
          <Button
            size="lg"
            className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-magenta-500 rounded-full shadow-2xl animate-cyber-glow hover:scale-110 transition-transform border-2 border-cyan-400"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </>
  );
}
