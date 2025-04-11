
// Ticket related types
export type TicketPriority = 'low' | 'medium' | 'high';
export type TicketCategory = 'technical' | 'billing' | 'feature' | 'general' | 'account';
export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Ticket {
  id: string;
  customerName: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
  satisfactionScore?: number;
}

export interface TicketAnalysis {
  category: TicketCategory;
  priority: TicketPriority;
  estimatedTime: string;
  requiredExpertise: string[];
  sentimentScore: number;
  keywords: string[];
  similarTickets: string[];
}

export interface TicketSolution {
  recommendedActions: string[];
  suggestedResponse: string;
  relatedKnowledgeBase: string[];
  confidence: number;
}

// AI Agent status types
export interface AgentStatus {
  connected: boolean;
  model: string;
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

// Stats and metrics types
export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  averageResolutionTime: string;
}

export interface CategoryDistribution {
  category: TicketCategory;
  count: number;
}

export interface PriorityDistribution {
  priority: TicketPriority;
  count: number;
}

// Mock data types for development
export interface MockData {
  tickets: Ticket[];
  stats: TicketStats;
  categoryDistribution: CategoryDistribution[];
  priorityDistribution: PriorityDistribution[];
  agentStatus: AgentStatus;
}
