
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppNav } from "./AppNav";
import { Separator } from "@/components/ui/separator";
import { AgentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  agentStatus: AgentStatus;
}

export function AppLayout({ agentStatus }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader agentStatus={agentStatus} />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-sidebar fixed w-64 inset-y-0 mt-14 transition-all duration-300 ease-in-out border-r z-10",
          sidebarOpen ? "left-0" : "-left-64 md:left-0 md:w-20"
        )}>
          <div className={cn(
            "h-full flex flex-col p-4 overflow-y-auto",
            !sidebarOpen && "md:items-center"
          )}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={cn(
                "font-semibold text-sidebar-foreground",
                !sidebarOpen && "md:hidden"
              )}>
                Navigation
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
            
            <AppNav />
          </div>
        </aside>
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-[5] md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Toggle sidebar button (mobile) */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed bottom-4 right-4 z-10 md:hidden shadow-md",
            sidebarOpen && "hidden"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {/* Main content */}
        <main className={cn(
          "flex-1 pt-14 transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20"
        )}>
          <div className="max-w-6xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
