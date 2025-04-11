
import { AIAgentStatus } from "@/components/dashboard/AIAgentStatus";
import { RecentTickets } from "@/components/dashboard/RecentTickets";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TicketDistributionChart } from "@/components/dashboard/TicketDistributionChart";
import { BarChart, Clock, InboxIcon, Users } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { useAgentStatus } from "@/hooks/useAgentStatus";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: tickets, isLoading } = useTickets();
  const { status: agentStatus } = useAgentStatus();
  
  // Calculate stats from real tickets
  const calculateStats = () => {
    if (!tickets) return {
      total: 0,
      open: 0,
      inProgress: 0,
      resolved: 0,
      averageResolutionTime: '0h',
    };
    
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    
    return {
      total: tickets.length,
      open,
      inProgress,
      resolved,
      averageResolutionTime: '4h 32m',
    };
  };
  
  const stats = calculateStats();
  
  // Calculate distribution data
  const calculateDistributions = () => {
    if (!tickets) return {
      categoryDistribution: [],
      priorityDistribution: [],
    };
    
    // Count categories
    const categories = tickets.reduce((acc, ticket) => {
      const category = ticket.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Count priorities
    const priorities = tickets.reduce((acc, ticket) => {
      const priority = ticket.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      categoryDistribution: Object.entries(categories).map(([category, count]) => ({
        category: category as any,
        count,
      })),
      priorityDistribution: Object.entries(priorities).map(([priority, count]) => ({
        priority: priority as any,
        count,
      })),
    };
  };
  
  const { categoryDistribution, priorityDistribution } = calculateDistributions();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tickets"
          value={stats.total}
          icon={InboxIcon}
          iconColor="text-primary"
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Open Tickets"
          value={stats.open}
          icon={InboxIcon}
          iconColor="text-support-high"
          trend={{ value: 5, positive: false }}
        />
        <StatsCard
          title="Avg. Resolution Time"
          value={stats.averageResolutionTime}
          icon={Clock}
          iconColor="text-support-medium"
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Active Customers"
          value={15}
          icon={Users}
          iconColor="text-support-info"
          trend={{ value: 3, positive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TicketDistributionChart 
            categoryData={categoryDistribution}
            priorityData={priorityDistribution}
          />
          <RecentTickets tickets={tickets || []} />
        </div>
        
        <div className="space-y-6">
          <AIAgentStatus initialStatus={agentStatus} />
        </div>
      </div>
    </div>
  );
};

export default Index;
