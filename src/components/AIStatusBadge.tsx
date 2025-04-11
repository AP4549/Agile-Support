
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleOff, Zap } from "lucide-react";
import { AgentStatus } from "@/types";

interface AIStatusBadgeProps {
  status: AgentStatus;
}

export function AIStatusBadge({ status }: AIStatusBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={status.connected ? "default" : "destructive"}
            className="gap-1 cursor-help"
          >
            {status.connected ? (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>AI Connected</span>
              </>
            ) : (
              <>
                <CircleOff className="h-3.5 w-3.5" />
                <span>AI Disconnected</span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p className="font-medium">{status.model}</p>
            <p>Response time: {status.responseTime}ms</p>
            <p>Last checked: {new Date(status.lastChecked).toLocaleTimeString()}</p>
            {status.error && <p className="text-destructive">{status.error}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
