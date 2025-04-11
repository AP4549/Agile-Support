import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from "@/types";
import { formatDate, getCategoryLabel } from "@/lib/utils";

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<TicketCategory[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<TicketPriority[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<TicketStatus[]>([]);
  
  // Filter tickets based on search query and selected filters
  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(ticket.category);
    
    // Priority filter
    const matchesPriority = 
      selectedPriorities.length === 0 || 
      selectedPriorities.includes(ticket.priority);
    
    // Status filter
    const matchesStatus = 
      selectedStatuses.length === 0 || 
      selectedStatuses.includes(ticket.status);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });
  
  // Toggle selection of a filter item
  const toggleCategory = (category: TicketCategory) => {
    setSelectedCategories((prev) => 
      prev.includes(category) 
        ? prev.filter((c) => c !== category) 
        : [...prev, category]
    );
  };
  
  const togglePriority = (priority: TicketPriority) => {
    setSelectedPriorities((prev) => 
      prev.includes(priority) 
        ? prev.filter((p) => p !== priority) 
        : [...prev, priority]
    );
  };
  
  const toggleStatus = (status: TicketStatus) => {
    setSelectedStatuses((prev) => 
      prev.includes(status) 
        ? prev.filter((s) => s !== status) 
        : [...prev, status]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSearchQuery("");
  };
  
  // Check if any filters are applied
  const hasFilters = 
    selectedCategories.length > 0 || 
    selectedPriorities.length > 0 || 
    selectedStatuses.length > 0 || 
    searchQuery !== "";
  
  return (
    <div>
      <PageHeader
        title="Support Tickets"
        description="View and manage customer support tickets"
        actions={
          <Button asChild>
            <Link to="/tickets/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Ticket
            </Link>
          </Button>
        }
      />
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Tickets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Category</DropdownMenuLabel>
              {(['technical', 'billing', 'feature', 'general', 'account'] as TicketCategory[]).map((category) => (
                <DropdownMenuItem 
                  key={category}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleCategory(category);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(category)}
                      readOnly
                    />
                    <span>{getCategoryLabel(category)}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Priority</DropdownMenuLabel>
              {(['low', 'medium', 'high'] as TicketPriority[]).map((priority) => (
                <DropdownMenuItem 
                  key={priority}
                  onSelect={(e) => {
                    e.preventDefault();
                    togglePriority(priority);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedPriorities.includes(priority)}
                      readOnly
                    />
                    <PriorityBadge priority={priority} />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
              {(['open', 'in-progress', 'resolved', 'closed'] as TicketStatus[]).map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleStatus(status);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedStatuses.includes(status)}
                      readOnly
                    />
                    <StatusBadge status={status} />
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            
            {hasFilters && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    clearFilters();
                  }}
                  className="justify-center text-center"
                >
                  Clear all filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">
                    <Link to={`/tickets/${ticket.id}`} className="text-primary hover:underline">
                      {ticket.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.subject}
                    </Link>
                  </TableCell>
                  <TableCell>{ticket.customerName}</TableCell>
                  <TableCell>{getCategoryLabel(ticket.category)}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                  <TableCell>{ticket.assignedTo || "Unassigned"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
