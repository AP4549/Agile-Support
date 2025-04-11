
import { MockData, Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/types";

// Helper function to create a date string in the past
const getDateInPast = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Generate mock tickets
const generateMockTickets = (count: number): Ticket[] => {
  const categories: TicketCategory[] = ['technical', 'billing', 'feature', 'general', 'account'];
  const priorities: TicketPriority[] = ['low', 'medium', 'high'];
  const statuses: TicketStatus[] = ['open', 'in-progress', 'resolved', 'closed'];
  const subjects = [
    'Cannot login to account',
    'Billing discrepancy on last invoice',
    'Feature request: Dark mode',
    'App crashes on startup',
    'Password reset not working',
    'Unable to update profile information',
    'Integration with third-party service failing',
    'Data not syncing between devices',
    'Request for account deletion',
    'Payment method update issue'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const createdDaysAgo = Math.floor(Math.random() * 30);
    const updatedDaysAgo = Math.floor(Math.random() * createdDaysAgo);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `T${String(i + 1).padStart(3, '0')}`,
      customerName: [
        'John Smith',
        'Jane Doe',
        'Robert Johnson',
        'Emily Williams',
        'Michael Brown',
        'Sarah Miller',
        'David Garcia',
        'Lisa Martinez',
        'Thomas Robinson',
        'Jennifer Lee'
      ][Math.floor(Math.random() * 10)],
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      description: `Detailed description for ticket ${i + 1}. This includes specific information about the issue the customer is experiencing.`,
      createdAt: getDateInPast(createdDaysAgo),
      updatedAt: getDateInPast(updatedDaysAgo),
      assignedTo: status !== 'open' ? [
        'Agent Cooper',
        'Agent Smith',
        'Agent Johnson',
        'Agent Williams'
      ][Math.floor(Math.random() * 4)] : undefined,
      resolution: status === 'resolved' || status === 'closed' 
        ? 'The issue was resolved by...' 
        : undefined,
      satisfactionScore: status === 'resolved' || status === 'closed' 
        ? Math.floor(Math.random() * 5) + 1 
        : undefined,
    };
  });
};

// Calculate stats based on tickets
const calculateStats = (tickets: Ticket[]) => {
  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in-progress').length;
  const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  return {
    total: tickets.length,
    open,
    inProgress,
    resolved,
    averageResolutionTime: '1d 4h'
  };
};

// Calculate category distribution
const calculateCategoryDistribution = (tickets: Ticket[]) => {
  const categories: TicketCategory[] = ['technical', 'billing', 'feature', 'general', 'account'];
  return categories.map(category => ({
    category,
    count: tickets.filter(t => t.category === category).length
  }));
};

// Calculate priority distribution
const calculatePriorityDistribution = (tickets: Ticket[]) => {
  const priorities: TicketPriority[] = ['low', 'medium', 'high'];
  return priorities.map(priority => ({
    priority,
    count: tickets.filter(t => t.priority === priority).length
  }));
};

// Create mock agent status
const generateAgentStatus = () => {
  return {
    connected: Math.random() > 0.2, // 80% chance of being connected
    model: 'Ollama/Mistral-7B',
    lastChecked: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
    error: Math.random() > 0.8 ? 'Connection timeout after 5 seconds' : undefined
  };
};

// Generate all mock data
export const generateMockData = (): MockData => {
  const tickets = generateMockTickets(25);
  
  return {
    tickets,
    stats: calculateStats(tickets),
    categoryDistribution: calculateCategoryDistribution(tickets),
    priorityDistribution: calculatePriorityDistribution(tickets),
    agentStatus: generateAgentStatus()
  };
};

// Export mock data
export const mockData = generateMockData();
