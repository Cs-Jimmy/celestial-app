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
      <nav className="relative z-50 cyber-panel border-b border-[#4ea8de]/50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-cyber-glow text-[#ffffff]"></div>
              <h1 className="text-xl font-bold text-pink-300 font-serif">celestial</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link key={path} href={path}>
                  <Button
                    variant="ghost"
                    className={`px-2 sm:px-4 py-2 rounded-lg transition-all hover:bg-[#4ea8de]/20 border border-transparent hover:border-[#4ea8de]/50 text-pink-200 hover:text-pink-100 font-mono uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap ${
                      location === path ? "bg-[#4ea8de]/20 border-[#4ea8de]/50 text-pink-100" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{label}</span>
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
            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full shadow-2xl animate-cyber-glow hover:scale-110 transition-transform border-2 border-[#4ea8de]"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </>
  );
}
