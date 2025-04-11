
"""
Time Estimator Agent
------------------
This agent estimates the time required to resolve support tickets.
"""

import json
import requests

class TimeEstimatorAgent:
    """Agent that estimates resolution time for customer support tickets."""
    
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.system_prompt = """
        You are a support resolution time estimator.
        Analyze the ticket and estimate how long it will take to resolve.
        Consider complexity, clarity of the issue, and any historical data.
        Format your response as JSON with this structure:
        {
          "estimatedMinutes": 45,
          "confidence": 0.7,
          "factors": [
            {"name": "Technical complexity", "impact": 0.3},
            {"name": "Clear reproduction steps", "impact": -0.1}
          ]
        }
        """
    
    def process_ticket(self, ticket, historical_context=None):
        """Process a ticket and return time estimation"""
        prompt = f"""
        Ticket #{ticket['id']}
        Subject: {ticket['subject']}
        Description: {ticket['description']}
        From: {ticket['customerName']} ({ticket.get('customerEmail', 'No email')})
        
        Historical Context:
        {historical_context or "No historical context available"}
        """
        
        response = self._call_ollama(prompt)
        
        try:
            # Try to parse the response as JSON
            if isinstance(response, str):
                result = json.loads(response)
            else:
                result = response
                
            # Ensure the response has the expected format
            if not "estimatedMinutes" in result:
                raise ValueError("Response missing required 'estimatedMinutes' field")
                
            return result
        except Exception as e:
            # Fallback for parsing errors
            return {
                "estimatedMinutes": 30,
                "confidence": 0.5,
                "factors": [
                    {"name": "Default estimation", "impact": 1.0}
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
                    "estimatedMinutes": 30,
                    "confidence": 0.5,
                    "factors": [
                        {"name": f"API error: {response.status_code}", "impact": 1.0}
                    ]
                }
        except Exception as e:
            return {
                "estimatedMinutes": 30,
                "confidence": 0.5,
                "factors": [
                    {"name": f"Error calling Ollama: {str(e)}", "impact": 1.0}
                ]
            }
