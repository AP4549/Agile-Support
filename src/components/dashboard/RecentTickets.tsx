
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Ticket } from "@/types";
import { formatDate, timeAgo, truncateText } from "@/lib/utils";
import { Link } from "react-router-dom";

interface RecentTicketsProps {
  tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  // Get 5 most recent tickets
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <Link 
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block"
            >
              <div className="ticket-card border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {truncateText(ticket.description, 80)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <div>{ticket.customerName}</div>
                  <div>
                    <time dateTime={ticket.createdAt} title={formatDate(ticket.createdAt)}>
                      {timeAgo(ticket.createdAt)}
                    </time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {recentTickets.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No tickets found
            </div>
          )}
          
          <div className="text-center mt-4">
            <Link 
              to="/tickets" 
              className="text-sm font-medium text-primary hover:underline"
            >
              View all tickets →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
