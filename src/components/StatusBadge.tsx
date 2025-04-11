
import { TicketStatus } from "@/types";
import { getStatusLabel, getStatusVariant } from "@/lib/utils";

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${getStatusVariant(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
