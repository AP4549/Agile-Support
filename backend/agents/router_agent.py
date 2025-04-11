"""
Router Agent
-----------
This agent analyzes tickets and determines which team they should be routed to.
"""

import json
import requests

class RouterAgent:
    """Agent that determines the appropriate team for handling customer support tickets."""
    
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.system_prompt = """
        You are a ticket routing specialist.
        Analyze the ticket and determine which team it should be routed to.
        Choose from: technical-support, billing, account-management, product-feedback, security, legal
        Format your response as JSON with this structure:
        {
          "recommendedTeam": "technical-support",
          "confidence": 0.85,
          "reasoning": "Explanation of why this team is appropriate"
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
    
    def process_ticket(self, ticket):
        """Process a ticket and return routing recommendations"""
        prompt = f"""
        Ticket #{ticket['id']}
        Subject: {ticket['subject']}
        Description: {ticket['description']}
        From: {ticket['customerName']} ({ticket.get('customerEmail', 'No email')})
        Status: {ticket.get('status', 'Unknown')}
        """
        
        response = self._call_ollama(prompt)
        
        if not response:
            return {
                "recommendedTeam": "technical-support",
                "confidence": 0.5,
                "reasoning": "Default routing due to API error"
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
            if not "recommendedTeam" in result:
                raise ValueError("Response missing required 'recommendedTeam' field")
                
            # Add default values for optional fields
            if "confidence" not in result:
                result["confidence"] = 0.5
            if "reasoning" not in result:
                result["reasoning"] = "No reasoning provided"
                
            return result
        except Exception as e:
            print(f"Error parsing router response: {str(e)}")
            # Fallback for parsing errors
            return {
                "recommendedTeam": "technical-support",
                "confidence": 0.5,
                "reasoning": "Default routing due to parsing error",
                "error": str(e)
            }
