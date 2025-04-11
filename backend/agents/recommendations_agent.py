"""
Recommendations Agent
-------------------
This agent provides suggested solutions for customer support tickets.
"""

import json
import requests

class RecommendationsAgent:
    """Agent that provides resolution recommendations for customer support tickets."""
    
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.system_prompt = """
        You are a support resolution specialist with access to historical cases.
        Analyze the ticket and historical data to recommend potential resolutions.
        Provide 1-3 suggested resolutions with clear steps.
        Keep your responses concise and actionable.
        Format your response as JSON with this structure:
        {
          "suggestedResolutions": [
            {
              "title": "Title of the resolution approach",
              "steps": ["Step 1", "Step 2", "Step 3"],
              "confidence": 0.85,
              "source": "Based on historical case #TECH_021"
            }
          ]
        }
        """
    
    def process_ticket(self, ticket, historical_context=None):
        """Process a ticket and return resolution recommendations"""
        # Extract fields with defaults for missing values
        ticket_id = ticket.get('id', 'Unknown')
        subject = ticket.get('subject', 'No Subject').strip()
        description = ticket.get('description', 'No Description').strip()
        customer_name = ticket.get('customerName', 'Unknown Customer').strip()
        customer_email = ticket.get('customerEmail', 'No email').strip()
        
        # Extract the most relevant information from the historical context
        # to keep prompts focused and concise
        context_summary = self._extract_relevant_context(historical_context)
        
        prompt = f"""
        Ticket #{ticket_id}
        Subject: {subject}
        Description: {description}
        From: {customer_name} ({customer_email})
        
        Historical Context:
        {context_summary}
        """
        
        response = self._call_ollama(prompt)
        
        try:
            # Try to parse the response as JSON
            if isinstance(response, str):
                result = json.loads(response)
            else:
                result = response
                
            # Ensure the response has the expected format
            if not "suggestedResolutions" in result:
                raise ValueError("Response missing required 'suggestedResolutions' field")
                
            return result
        except Exception as e:
            # Fallback for parsing errors
            return {
                "suggestedResolutions": [
                    {
                        "title": "General troubleshooting approach",
                        "steps": [
                            "Gather more information from the customer",
                            "Reproduce the issue in a test environment",
                            "Apply standard fixes based on the issue category"
                        ],
                        "confidence": 0.5,
                        "source": "Standard procedure"
                    }
                ],
                "error": str(e)
            }
    
    def _extract_relevant_context(self, historical_context):
        """Extract the most relevant parts of the historical context"""
        if not historical_context:
            return "No historical context available"
            
        # Extract only the most relevant parts to keep prompts concise
        sections = historical_context.split("---")
        
        # Extract solutions from relevant tickets
        solutions = []
        conversation_example = ""
        
        for section in sections:
            if "RELEVANT HISTORICAL TICKETS" in section:
                # Extract solution patterns
                lines = section.strip().split("\n")
                current_solution = {}
                
                for line in lines:
                    if line.startswith("Issue:"):
                        current_solution["issue"] = line.replace("Issue:", "").strip()
                    elif line.startswith("Solution:"):
                        current_solution["solution"] = line.replace("Solution:", "").strip()
                        
                    # When we find a complete entry, add it to our solutions
                    if "issue" in current_solution and "solution" in current_solution:
                        solutions.append(f"For {current_solution['issue']}: {current_solution['solution']}")
                        current_solution = {}
                        
            elif "RELEVANT CONVERSATION EXAMPLE" in section:
                # Keep only essential parts of the conversation
                conversation_lines = section.strip().split("\n")
                for i, line in enumerate(conversation_lines):
                    if "Customer:" in line:
                        customer_msg = line
                    elif "Agent:" in line and i > 0 and "Customer:" in conversation_lines[i-1]:
                        # Only keep agent responses that directly follow customer messages
                        conversation_example += f"{customer_msg}\n{line}\n"
        
        # Combine the extracted information
        condensed_context = "Historical Solutions:\n"
        for i, solution in enumerate(solutions[:3]):  # Limit to top 3
            condensed_context += f"{i+1}. {solution}\n"
            
        if conversation_example:
            condensed_context += "\nRelevant Conversation:\n" + conversation_example
            
        return condensed_context
    
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
                    "suggestedResolutions": [
                        {
                            "title": "API Error",
                            "steps": [f"Ollama API returned status code {response.status_code}"],
                            "confidence": 0.1,
                            "source": "Error handling"
                        }
                    ]
                }
        except Exception as e:
            return {
                "suggestedResolutions": [
                    {
                        "title": "Error calling Ollama",
                        "steps": [str(e)],
                        "confidence": 0.1,
                        "source": "Error handling"
                    }
                ]
            }
