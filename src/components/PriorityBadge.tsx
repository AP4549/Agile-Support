
import { TicketPriority } from "@/types";
import { getPriorityLabel, getPriorityVariant } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`status-badge ${getPriorityVariant(priority)}`}>
      {getPriorityLabel(priority)}
    </span>
  );
}
