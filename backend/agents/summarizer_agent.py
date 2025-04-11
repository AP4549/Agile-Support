"""
Summarizer Agent
---------------
This agent analyzes support tickets and provides a concise summary, key points, and sentiment.
"""

import json
import requests

class SummarizerAgent:
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.system_prompt = """
        You are an expert customer support summarizer. 
        Analyze the ticket and provide a concise summary, key points, and the sentiment of the customer.
        Consider the historical context if provided.
        Format your response as JSON like this: 
        {
            "summary": "A clear, concise summary of the issue",
            "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
            "sentiment": "positive|neutral|negative",
            "similarTickets": ["TICKET_ID1", "TICKET_ID2"],
            "confidence": 0.85
        }
        """
    
    def _call_ollama(self, prompt):
        """Call Ollama API with error handling"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": f"{self.system_prompt}\n\n{prompt}",
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()
            return response.json().get("response", "")
        except Exception as e:
            print(f"Error calling Ollama: {str(e)}")
            return None
    
    def process_ticket(self, ticket, historical_context=None):
        """Process a ticket and return a summary"""
        # Extract fields with defaults for missing values
        ticket_id = ticket.get('id', 'Unknown')
        subject = ticket.get('subject', 'No Subject').strip()
        description = ticket.get('description', 'No Description').strip()
        customer_name = ticket.get('customerName', 'Unknown Customer').strip()
        customer_email = ticket.get('customerEmail', 'No email').strip()
        category = ticket.get('category', 'unknown').strip()
        priority = ticket.get('priority', 'medium').strip()
        status = ticket.get('status', 'open').strip()
        
        prompt = f"""
        Ticket #{ticket_id}
        Subject: {subject}
        Description: {description}
        From: {customer_name} ({customer_email})
        Category: {category}
        Priority: {priority}
        Status: {status}
        
        Historical Context:
        {historical_context or "No historical context available"}
        
        Please analyze this ticket and provide:
        1. A clear summary of the issue
        2. Key points that need attention
        3. The customer's sentiment
        4. Similar historical tickets if any
        5. Your confidence in the analysis
        """
        
        response = self._call_ollama(prompt)
        
        if not response:
            return {
                "summary": "Error generating summary",
                "keyPoints": ["Error processing the ticket"],
                "sentiment": "neutral",
                "similarTickets": [],
                "confidence": 0.0
            }
        
        try:
            # Try to parse the response as JSON
            if isinstance(response, str):
                # Clean up the response string to ensure it's valid JSON
                response = response.strip()
                if response.startswith("```json"):
                    response = response[7:]
                if response.endswith("```"):
                    response = response[:-3]
                response = response.strip()
                
                result = json.loads(response)
            else:
                result = response
                
            # Ensure the response has the expected format
            if not all(k in result for k in ["summary", "keyPoints", "sentiment"]):
                raise ValueError("Response missing required fields")
                
            # Add default values for optional fields
            if "similarTickets" not in result:
                result["similarTickets"] = []
            if "confidence" not in result:
                result["confidence"] = 0.5
                
            return result
        except Exception as e:
            print(f"Error parsing summarizer response: {str(e)}")
            # Fallback for parsing errors
            return {
                "summary": "Error generating summary",
                "keyPoints": ["Error processing the ticket"],
                "sentiment": "neutral",
                "similarTickets": [],
                "confidence": 0.0,
                "error": str(e)
            }
