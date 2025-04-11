
import { useQuery } from '@tanstack/react-query';
import { fetchTickets } from '@/lib/utils';
import { Ticket } from '@/types';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const tickets = await fetchTickets();
      // Transform tickets from backend format to frontend format if needed
      return tickets.map((ticket: any) => ({
        id: ticket.id,
        customerName: ticket.customerName,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status === 'resolved' ? 'resolved' : 'open',
        priority: 'medium', // Default for historical tickets
        category: 'technical', // Default for historical tickets
        createdAt: ticket.createdAt || new Date().toISOString(),
        updatedAt: ticket.createdAt || new Date().toISOString(),
      })) as Ticket[];
    },
  });
}
