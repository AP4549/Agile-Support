
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentStatus } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleOff, Zap, RefreshCw } from "lucide-react";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { toast } from "sonner";

interface AIAgentStatusProps {
  initialStatus?: AgentStatus;
}

export function AIAgentStatus({ initialStatus }: AIAgentStatusProps) {
  const { status, isRefreshing, refreshStatus } = useAgentStatus(initialStatus);
  
  const handleRefresh = () => {
    refreshStatus();
    
    toast.success("Refreshing agent status", {
      description: "Checking connection to Ollama...",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Agent Status</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw 
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} 
            />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`rounded-full p-6 ${status.connected ? "bg-green-100" : "bg-red-100"}`}>
            {status.connected ? (
              <Zap className="h-8 w-8 text-green-600" />
            ) : (
              <CircleOff className="h-8 w-8 text-red-600" />
            )}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-medium">
              {status.connected ? "Connected" : "Disconnected"}
            </div>
            <div className="text-sm text-muted-foreground">
              {status.model}
            </div>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Response Time:</div>
            <div className="text-right font-medium">
              {status.responseTime}ms
            </div>
            
            <div className="text-muted-foreground">Last Checked:</div>
            <div className="text-right font-medium">
              {formatDateTime(status.lastChecked)}
            </div>
            
            {status.error && (
              <>
                <div className="text-destructive col-span-2 mt-2">Error:</div>
                <div className="text-destructive col-span-2 text-xs">
                  {status.error}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
