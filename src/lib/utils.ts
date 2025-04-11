import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TicketCategory, TicketPriority, TicketStatus } from "@/types";

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date functions
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString();
}

export function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  
  // Convert to seconds
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  // Convert to minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  
  // Convert to hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  
  // Convert to days
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  
  // Convert to months
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  
  // Convert to years
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Status utilities
export function getStatusLabel(status: TicketStatus) {
  const labels = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
  };
  return labels[status] || status;
}

export function getStatusVariant(status: TicketStatus) {
  const variants = {
    'open': 'warning',
    'in-progress': 'info',
    'resolved': 'success',
    'closed': 'default',
  };
  return variants[status] || 'default';
}

// Priority utilities
export function getPriorityLabel(priority: TicketPriority) {
  const labels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
  };
  return labels[priority] || priority;
}

export function getPriorityVariant(priority: TicketPriority) {
  const variants = {
    'low': 'default',
    'medium': 'warning',
    'high': 'destructive',
  };
  return variants[priority] || 'default';
}

// Category utilities
export function getCategoryLabel(category: TicketCategory) {
  const labels = {
    'technical': 'Technical',
    'billing': 'Billing',
    'feature': 'Feature',
    'general': 'General',
    'account': 'Account',
  };
  return labels[category] || category;
}

// API functions for backend communication
const API_BASE_URL = 'http://localhost:5000';

export async function fetchAPIStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching API status:", error);
    return {
      status: "error",
      ollama_connected: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function fetchTickets() {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
}

export async function processTicket(ticket: any, model = "gemma3:4b") {
  try {
    const response = await fetch(`${API_BASE_URL}/process-ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticket, model }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error processing ticket:", error);
    throw error;
  }
}

export async function fetchHistoricalData() {
  try {
    const response = await fetch(`${API_BASE_URL}/historical-data`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}

export async function fetchConversations() {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

export async function createTicket(ticketData: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}
