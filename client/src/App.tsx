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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mood-tracker" component={MoodTracker} />
      <Route path="/mission-log" component={MissionLog} />
      <Route path="/analytics" component={Analytics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen cosmic-bg text-white overflow-x-hidden">
          {/* Star Field Background */}
          <div className="fixed inset-0 stars opacity-30 animate-twinkle"></div>
          
          <Navigation />
          
          <main className="relative z-10">
            <Router />
          </main>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
