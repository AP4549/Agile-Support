import os
import csv
import json
from pathlib import Path
from ticket_service import get_all_tickets, map_issue_category, map_priority
from datetime import datetime
import uuid

class DataLoader:
    def __init__(self):
        """Initialize data loader and load historical ticket data and conversations"""
        self.data_dir = Path(__file__).parent / "data"
        self.historical_tickets = self._load_historical_tickets()
        self.conversations = self._load_conversations()
        
        # Create mappings for faster lookups
        self.category_to_tickets = self._create_category_mapping()
        self.category_to_conversation = self._create_conversation_mapping()
        
        # Load tickets
        self.tickets = get_all_tickets(self)
        
        print(f"Loaded {len(self.historical_tickets)} historical tickets and {len(self.conversations)} conversations")
        print(f"Available categories: {list(self.category_to_conversation.keys())}")

    def _load_historical_tickets(self):
        """Load historical ticket data from CSV file"""
        tickets = []
        csv_path = self.data_dir / "Historical_ticket_data.csv"
        
        try:
            print(f"Loading historical tickets from: {csv_path}")
            if not csv_path.exists():
                print(f"CSV file not found at: {csv_path}")
                return []
                
            print("Reading file contents...")
            # Read the file content first to check for issues
            with open(csv_path, mode='r', encoding='utf-8-sig', errors='replace') as file:
                content = file.read()
                print(f"File size: {len(content)} bytes")
                
            # Check if the file is empty or has formatting issues
            if not content.strip():
                print("CSV file is empty")
                return []
                
            # Split content into lines and process manually
            lines = [line.strip() for line in content.split('\n') if line.strip()]
            print(f"Found {len(lines)} non-empty lines")
            
            if not lines:
                print("No valid lines found in CSV file")
                return []
                
            # Get headers from first line
            headers = [h.strip() for h in lines[0].split(',')]
            print(f"Found headers: {headers}")
            
            if not headers:
                print("No headers found in CSV file")
                return []
                
            # Process each data line
            print("Processing data lines...")
            for i, line in enumerate(lines[1:], 1):
                try:
                    print(f"\nProcessing line {i}: {line}")
                    values = [v.strip() for v in line.split(',')]
                    print(f"Split into {len(values)} values: {values}")
                    
                    if len(values) >= len(headers):
                        row = dict(zip(headers, values))
                        print(f"Created row dictionary: {row}")
                        
                        ticket = {
                            'Ticket ID': row.get('Ticket ID', 'Unknown'),
                            'Issue Category': row.get('Issue Category', 'General'),
                            'Sentiment': row.get('Sentiment', 'neutral'),
                            'Priority': row.get('Priority', 'medium'),
                            'Solution': row.get('Solution', 'No solution recorded'),
                            'Resolution Status': row.get('Resolution Status', 'open'),
                            'Date of Resolution': row.get('Date of Resolution', '')
                        }
                        
                        if ticket['Ticket ID'] != 'Unknown':
                            tickets.append(ticket)
                            print(f"Successfully loaded ticket: {ticket['Ticket ID']}")
                        else:
                            print(f"Skipping ticket with unknown ID")
                    else:
                        print(f"Line {i} has insufficient values ({len(values)} < {len(headers)})")
                except Exception as e:
                    print(f"Error processing line {i}: {line}")
                    print(f"Error details: {str(e)}")
                    continue
                    
            print(f"\nSuccessfully loaded {len(tickets)} historical tickets")
            return tickets
        except Exception as e:
            print(f"Error loading historical tickets: {e}")
            import traceback
            print(traceback.format_exc())
            return []

    def _load_conversations(self):
        """Load conversation examples from the Conversation directory"""
        conversations = {}
        conv_dir = self.data_dir / "Conversation"
        
        if not conv_dir.exists():
            print(f"Conversation directory not found: {conv_dir}")
            return {}
            
        try:
            for file_path in conv_dir.glob("*.txt"):
                category = file_path.stem
                with open(file_path, mode='r', encoding='utf-8') as file:
                    content = file.read()
                    conversations[category] = content
            return conversations
        except Exception as e:
            print(f"Error loading conversations: {e}")
            return {}
    
    def _create_category_mapping(self):
        """Create mapping from categories to relevant tickets"""
        mapping = {}
        for ticket in self.historical_tickets:
            category = ticket.get('Issue Category', '').strip()
            if category:
                if category not in mapping:
                    mapping[category] = []
                mapping[category].append(ticket)
        return mapping

    def _create_conversation_mapping(self):
        """Create mapping from categories to conversations"""
        mapping = {}
        for category, content in self.conversations.items():
            # Normalize category name to match ticket categories
            norm_category = category.strip()
            mapping[norm_category] = content
        return mapping

    def get_combined_data_for_ticket(self, ticket):
        """Get relevant historical data and conversations for a ticket"""
        combined_data = ""
        
        # First, try exact category matching
        ticket_subject = ticket.get('subject', '').strip()
        
        # Find relevant historical tickets based on subject
        relevant_tickets = []
        
        # Try direct category match first
        if ticket_subject in self.category_to_tickets:
            relevant_tickets = self.category_to_tickets[ticket_subject][:3]  # Top 3 matches
        
        # If no direct match, try partial matching
        if not relevant_tickets:
            for category, tickets in self.category_to_tickets.items():
                if (ticket_subject.lower() in category.lower() or 
                    category.lower() in ticket_subject.lower()):
                    relevant_tickets.extend(tickets[:2])  # Add top 2 from each partial match
            
            # Sort by priority to get most relevant
            relevant_tickets = sorted(
                relevant_tickets, 
                key=lambda t: t.get('Priority', 'Low').lower() == 'high', 
                reverse=True
            )[:3]
        
        # Find relevant conversation based on the subject
        relevant_conversation = None
        
        # Try direct match first
        if ticket_subject in self.category_to_conversation:
            relevant_conversation = self.category_to_conversation[ticket_subject]
        
        # If no direct match, try partial matching
        if not relevant_conversation:
            best_match = None
            longest_match = 0
            
            for category, conversation in self.category_to_conversation.items():
                if (ticket_subject.lower() in category.lower() or 
                    category.lower() in ticket_subject.lower()):
                    # Choose the closest match by length
                    match_length = max(
                        len(category) if category.lower() in ticket_subject.lower() else 0,
                        len(ticket_subject) if ticket_subject.lower() in category.lower() else 0
                    )
                    if match_length > longest_match:
                        longest_match = match_length
                        best_match = conversation
            
            relevant_conversation = best_match
        
        # Format relevant tickets
        if relevant_tickets:
            combined_data += "--- RELEVANT HISTORICAL TICKETS ---\n"
            for i, ticket in enumerate(relevant_tickets, 1):
                combined_data += f"Case #{i}: {ticket.get('Ticket ID', 'Unknown')}\n"
                combined_data += f"Issue: {ticket.get('Issue Category', 'Unknown')}\n"
                combined_data += f"Customer Sentiment: {ticket.get('Sentiment', 'Unknown')}\n"
                combined_data += f"Priority: {ticket.get('Priority', 'Unknown')}\n"
                combined_data += f"Solution: {ticket.get('Solution', 'No solution recorded')}\n"
                combined_data += f"Status: {ticket.get('Resolution Status', 'Unknown')}\n\n"
        
        # Format relevant conversation
        if relevant_conversation:
            combined_data += "--- RELEVANT CONVERSATION EXAMPLE ---\n"
            combined_data += relevant_conversation + "\n"
        
        return combined_data
        
    def get_tickets(self):
        """Get all tickets"""
        return self.tickets
        
    def get_ticket(self, ticket_id):
        """Get a specific ticket by ID"""
        for ticket in self.tickets:
            if ticket.get('id') == ticket_id:
                return ticket
        return None
        
    def get_ticket_history(self, ticket_id):
        """Get history for a specific ticket"""
        # For now, just return the ticket itself as history
        ticket = self.get_ticket(ticket_id)
        if ticket:
            return {
                "ticket": ticket,
                "history": [
                    {
                        "timestamp": ticket.get('createdAt', ''),
                        "action": "Ticket created",
                        "details": f"Ticket {ticket_id} was created with subject: {ticket.get('subject', '')}"
                    }
                ]
            }
        return None
        
    def get_knowledge_base(self):
        """Get all knowledge base articles"""
        # For now, return a simple knowledge base
        return [
            {
                "id": "KB001",
                "title": "Common Login Issues",
                "category": "authentication",
                "content": "If users are having trouble logging in, check their credentials and ensure the authentication service is running."
            },
            {
                "id": "KB002",
                "title": "Payment Processing",
                "category": "billing",
                "content": "For payment processing issues, verify the payment gateway connection and check for any error codes in the logs."
            },
            {
                "id": "KB003",
                "title": "Mobile App Troubleshooting",
                "category": "technical",
                "content": "For mobile app issues, check the device compatibility, OS version, and ensure the app is up to date."
            }
        ]
        
    def get_knowledge_base_article(self, article_id):
        """Get a specific knowledge base article"""
        articles = self.get_knowledge_base()
        for article in articles:
            if article.get('id') == article_id:
                return article
        return None

    def create_ticket(self, ticket_data):
        """Create a new ticket and add it to the ticket list"""
        # Generate a new ticket ID
        ticket_id = f"T{str(uuid.uuid4())[:8]}"
        
        # Create timestamp
        current_time = datetime.now().isoformat()
        
        # Create the new ticket
        new_ticket = {
            "id": ticket_id,
            "subject": ticket_data.get('subject'),
            "description": ticket_data.get('description'),
            "customerName": ticket_data.get('customerName'),
            "customerEmail": ticket_data.get('customerEmail', ''),
            "category": ticket_data.get('category'),
            "priority": ticket_data.get('priority'),
            "status": ticket_data.get('status', 'open'),
            "createdAt": current_time,
            "updatedAt": current_time,
            "assignedTo": ticket_data.get('assignedTo', None)
        }
        
        # Add the ticket to our list
        self.tickets.append(new_ticket)
        
        print(f"Created new ticket: {ticket_id}")
        return new_ticket
