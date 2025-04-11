
import { TicketList } from "@/components/tickets/TicketList";
import { useTickets } from "@/hooks/useTickets";
import { Skeleton } from "@/components/ui/skeleton";

const TicketsPage = () => {
  const { data: tickets, isLoading, error } = useTickets();
  
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
        <h2 className="text-xl font-semibold text-destructive">Error loading tickets</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    );
  }
  
  return <TicketList tickets={tickets || []} />;
};

export default TicketsPage;
