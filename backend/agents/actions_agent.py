
"""
Actions Agent
------------
This agent analyzes tickets and extracts required actions with priorities.
"""

import json
import requests

class ActionsAgent:
    """Agent that identifies required actions for resolving customer support tickets."""
    
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.system_prompt = """
        You are an expert action identifier for customer support.
        Analyze the ticket and extract 2-4 specific actions needed to resolve it.
        Each action should have a type, priority, and description.
        Format your response as JSON with this structure:
        {
          "actions": [
            {
              "type": "investigation",
              "priority": "high",
              "description": "Details of what needs to be investigated"
            }
          ]
        }
        """
    
    def process_ticket(self, ticket):
        """Process a ticket and return required actions"""
        prompt = f"""
        Ticket #{ticket['id']}
        Subject: {ticket['subject']}
        Description: {ticket['description']}
        From: {ticket['customerName']} ({ticket.get('customerEmail', 'No email')})
        """
        
        response = self._call_ollama(prompt)
        
        try:
            # Try to parse the response as JSON
            if isinstance(response, str):
                result = json.loads(response)
            else:
                result = response
                
            # Ensure the response has the expected format
            if not "actions" in result:
                raise ValueError("Response missing required 'actions' field")
                
            return result
        except Exception as e:
            # Fallback for parsing errors
            return {
                "actions": [
                    {
                        "type": "investigation",
                        "priority": "medium",
                        "description": "Investigate the issue described in the ticket"
                    },
                    {
                        "type": "contact",
                        "priority": "medium",
                        "description": "Contact the customer for more information"
                    }
                ],
                "error": str(e)
            }
    
    def _call_ollama(self, prompt):
        """Call Ollama API with the given prompt"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "system": self.system_prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json().get("response", "")
                # Attempt to parse as JSON if it looks like JSON
                if result.strip().startswith("{") and result.strip().endswith("}"):
                    try:
                        return json.loads(result)
                    except:
                        pass
                return result
            else:
                return {
                    "actions": [
                        {
                            "type": "error",
                            "priority": "high",
                            "description": f"Ollama API returned status code {response.status_code}"
                        }
                    ]
                }
        except Exception as e:
            return {
                "actions": [
                    {
                        "type": "error",
                        "priority": "high",
                        "description": f"Error calling Ollama: {str(e)}"
                    }
                ]
            }
