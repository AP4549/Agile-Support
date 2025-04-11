from datetime import datetime

def get_all_tickets(data_loader):
    """Get all tickets from historical data and add some unresolved ones"""
    # Create a dictionary to track unique ticket IDs
    unique_tickets = {}
    
    # Process historical tickets and ensure unique IDs
    print(f"Processing {len(data_loader.historical_tickets)} historical tickets")
    for ticket in data_loader.historical_tickets:
        ticket_id = ticket.get("Ticket ID", "").strip()
        
        # Skip entries without valid IDs
        if not ticket_id:
            continue
            
        # Map the issue category to our internal categories
        issue_category = ticket.get("Issue Category", "").strip().lower()
        category = map_issue_category(issue_category)
        
        # Map priority to our internal priorities
        priority = map_priority(ticket.get("Priority", "medium"))
            
        # Only add the ticket if we haven't seen this ID before
        if ticket_id not in unique_tickets:
            unique_tickets[ticket_id] = {
                "id": ticket_id,
                "subject": ticket.get("Issue Category", "No Subject").strip(),
                "description": ticket.get("Solution", "No Description").strip(),
                "customerName": "Historical Data",
                "customerEmail": "historical@example.com",
                "createdAt": ticket.get("Date of Resolution", datetime.now().isoformat()).strip(),
                "status": "resolved" if ticket.get("Resolution Status", "").lower() == "resolved" else "open",
                "priority": priority,
                "category": category,
                "sentiment": ticket.get("Sentiment", "neutral").lower(),
                "resolution": ticket.get("Solution", "").strip(),
            }
            print(f"Added historical ticket: {ticket_id}")
    
    # Convert dictionary to list
    tickets = list(unique_tickets.values())
    print(f"Processed {len(tickets)} historical tickets")

    # Add more unresolved tickets with relevant data
    ticket_templates = [
        {
            "id": "T006",
            "subject": "Payment Gateway Integration Failure",
            "description": "Unable to process payment for the subscription. The payment gateway returns an error code 403.",
            "customerName": "Alice Brown",
            "customerEmail": "alice.brown@example.com",
            "createdAt": datetime.now().isoformat(),
            "status": "open",
            "priority": "high",
            "category": "billing",
            "sentiment": "urgent",
        },
        {
            "id": "T007",
            "subject": "Feature request: Multi-language support",
            "description": "Requesting support for multiple languages in the app. Our company is expanding to international markets.",
            "customerName": "Carlos Garcia",
            "customerEmail": "carlos.garcia@example.com",
            "createdAt": datetime.now().isoformat(),
            "status": "open",
            "priority": "medium",
            "category": "feature",
            "sentiment": "neutral",
        },
        {
            "id": "T008",
            "subject": "Device Compatibility Error",
            "description": "The app crashes immediately after launching on Android devices. Using Samsung Galaxy S21.",
            "customerName": "Diana Evans",
            "customerEmail": "diana.evans@example.com",
            "createdAt": datetime.now().isoformat(),
            "status": "open",
            "priority": "high",
            "category": "technical",
            "sentiment": "annoyed",
        },
    ]
    
    tickets.extend(ticket_templates)
    print(f"Added {len(ticket_templates)} new tickets")
    
    print(f"Generated {len(tickets)} total tickets ({len(unique_tickets)} historical, {len(ticket_templates)} new)")
    return tickets

def map_issue_category(category):
    """Map historical issue categories to internal categories"""
    category = category.lower()
    if "payment" in category or "billing" in category:
        return "billing"
    elif "feature" in category or "language" in category:
        return "feature"
    elif "account" in category or "sync" in category:
        return "account"
    elif "device" in category or "compatibility" in category:
        return "technical"
    elif "network" in category or "connectivity" in category:
        return "technical"
    elif "software" in category or "installation" in category:
        return "technical"
    else:
        return "general"

def map_priority(priority):
    """Map historical priorities to internal priorities"""
    priority = priority.lower()
    if priority in ["critical", "urgent", "high"]:
        return "high"
    elif priority in ["medium", "moderate"]:
        return "medium"
    else:
        return "low"
