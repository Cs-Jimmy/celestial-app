// Import routing and page components
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import MoodTracker from "@/pages/mood-tracker";
import MissionLog from "@/pages/mission-log";
import Analytics from "@/pages/analytics";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

// Component that defines which page to show based on URL
function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mood-tracker" component={MoodTracker} />
      <Route path="/mission-log" component={MissionLog} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/login" component={Login} />
      {/* Show 404 page for unknown URLs */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Main app component that wraps everything
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen y2k-bg text-cyan-400 overflow-x-hidden max-w-full">
          {/* Distant starfield layer for 3D depth */}
          <div className="starfield-distant"></div>
          {/* Animated background pattern */}
          <div className="fixed inset-0 matrix-grid animate-matrix-scroll"></div>
          
          {/* Top navigation bar */}
          <Navigation />
          
          {/* Main content area where pages appear */}
          <main className="relative z-10">
            <Router />
          </main>
          
          {/* Toast notifications for user feedback */}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
