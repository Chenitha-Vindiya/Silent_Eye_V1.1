import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoadingScreen from "@/components/ui/loading-screen";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Alerts from "@/pages/alerts";
import History from "@/pages/history";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/history" component={History} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen gradient-bg text-white">
          <Toaster />
          {isLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <Router />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
