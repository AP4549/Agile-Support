import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/Index";
import TicketsPage from "@/pages/TicketsPage";
import TicketDetailPage from "@/pages/TicketDetailPage";
import CreateTicketPage from "@/pages/CreateTicketPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { AgentStatus } from "./types";
import { fetchAPIStatus } from "./lib/utils";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    connected: false,
    model: "llama3:8b",
    lastChecked: new Date().toISOString()
  });

  useEffect(() => {
    // Check API status on load
    const checkStatus = async () => {
      try {
        const status = await fetchAPIStatus();
        setAgentStatus({
          connected: status.ollama_connected === true,
          model: status.models ? status.models[0]?.name || "llama3:8b" : "llama3:8b",
          lastChecked: new Date().toISOString(),
          responseTime: status.responseTime || 0
        });
      } catch (error) {
        console.error("Error fetching API status:", error);
        setAgentStatus({
          connected: false,
          model: "llama3:8b",
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };
    
    checkStatus();
    
    // Periodically check status
    const interval = setInterval(checkStatus, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout agentStatus={agentStatus} />}>
            <Route index element={<DashboardPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="tickets/new" element={<CreateTicketPage />} />
            <Route path="tickets/:id" element={<TicketDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
      
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
