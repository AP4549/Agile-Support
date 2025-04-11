
import { useParams, Navigate } from "react-router-dom";
import { TicketDetail } from "@/components/tickets/TicketDetail";
import { useTickets } from "@/hooks/useTickets";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { Skeleton } from "@/components/ui/skeleton";

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tickets, isLoading, error } = useTickets();
  const { status: agentStatus } = useAgentStatus();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-destructive">Error loading ticket</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
  
  const ticket = tickets?.find((ticket) => ticket.id === id);
  
  if (!ticket) {
    return <Navigate to="/tickets" replace />;
  }
  
  return <TicketDetail ticket={ticket} agentStatus={agentStatus} />;
};

export default TicketDetailPage;
