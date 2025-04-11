"""
Agent Service
------------
Coordinates multiple specialized agents to process customer support tickets.
Implements a multi-agent framework for automated customer support operations.
"""

from agents.summarizer_agent import SummarizerAgent
from agents.sentiment_analyzer import SentimentAnalyzerAgent
from agents.actions_agent import ActionsAgent
from agents.router_agent import RouterAgent
from agents.time_estimator_agent import TimeEstimatorAgent
from agents.recommendations_agent import RecommendationsAgent
import traceback
import time

class AgentService:
    def __init__(self, ollama_url, model):
        self.ollama_url = ollama_url
        self.model = model
        self.agents = {}
        self.initialize_agents()
    
    def initialize_agents(self):
        """Initialize all specialized agents"""
        self.agents = {
            'summarizer': SummarizerAgent(self.ollama_url, self.model),
            'sentiment': SentimentAnalyzerAgent(),  # This one doesn't use Ollama
            'actions': ActionsAgent(self.ollama_url, self.model),
            'router': RouterAgent(self.ollama_url, self.model),
            'time_estimator': TimeEstimatorAgent(self.ollama_url, self.model),
            'recommendations': RecommendationsAgent(self.ollama_url, self.model)
        }
    
    def process_ticket(self, ticket, historical_context=None):
        """Process a ticket using the multi-agent framework"""
        results = {}
        start_time = time.time()
        
        try:
            # Step 1: Initial Analysis (Summary and Sentiment)
            print("Step 1: Performing initial analysis...")
            initial_analysis = self._perform_initial_analysis(ticket, historical_context)
            results.update(initial_analysis)
            
            # Step 2: Action Extraction and Routing
            print("Step 2: Extracting actions and determining routing...")
            action_routing = self._extract_actions_and_route(ticket, initial_analysis)
            results.update(action_routing)
            
            # Step 3: Resolution Planning
            print("Step 3: Planning resolution...")
            resolution_plan = self._plan_resolution(ticket, initial_analysis, action_routing, historical_context)
            results.update(resolution_plan)
            
            # Add processing metadata
            results['metadata'] = {
                'processing_time': time.time() - start_time,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'model_used': self.model
            }
            
            return results
            
        except Exception as e:
            print(f"Error in multi-agent processing: {str(e)}")
            print(traceback.format_exc())
            return self._get_fallback_results(str(e))
    
    def _perform_initial_analysis(self, ticket, historical_context):
        """Perform initial analysis using summary and sentiment agents"""
        results = {}
        
        # Get summary
        try:
            summary_result = self.agents['summarizer'].process_ticket(ticket, historical_context)
            results['summary'] = summary_result
        except Exception as e:
            print(f"Summarizer error: {str(e)}")
            results['summary'] = self._get_default_summary()
        
        # Get sentiment
        try:
            sentiment_result = self.agents['sentiment'].analyze_ticket(ticket)
            results['sentiment'] = sentiment_result
        except Exception as e:
            print(f"Sentiment analyzer error: {str(e)}")
            results['sentiment'] = self._get_default_sentiment()
        
        return results
    
    def _extract_actions_and_route(self, ticket, initial_analysis):
        """Extract actions and determine routing based on initial analysis"""
        results = {}
        
        # Get actions
        try:
            actions_result = self.agents['actions'].process_ticket(ticket)
            results['actions'] = actions_result
        except Exception as e:
            print(f"Actions agent error: {str(e)}")
            results['actions'] = self._get_default_actions()
        
        # Get routing
        try:
            routing_result = self.agents['router'].process_ticket(ticket)
            results['routing'] = routing_result
        except Exception as e:
            print(f"Router agent error: {str(e)}")
            results['routing'] = self._get_default_routing()
        
        return results
    
    def _plan_resolution(self, ticket, initial_analysis, action_routing, historical_context):
        """Plan resolution using time estimation and recommendations"""
        results = {}
        
        # Get time estimation
        try:
            time_result = self.agents['time_estimator'].process_ticket(ticket, historical_context)
            results['timeEstimation'] = time_result
        except Exception as e:
            print(f"Time estimator error: {str(e)}")
            results['timeEstimation'] = self._get_default_time_estimation()
        
        # Get recommendations
        try:
            recommendations_result = self.agents['recommendations'].process_ticket(ticket, historical_context)
            results['recommendations'] = recommendations_result
        except Exception as e:
            print(f"Recommendations agent error: {str(e)}")
            results['recommendations'] = self._get_default_recommendations()
        
        return results
    
    def _get_default_summary(self):
        return {
            "summary": "Error generating summary",
            "keyPoints": ["Error processing the ticket"],
            "sentiment": "neutral",
            "similarTickets": [],
            "confidence": 0.0
        }
    
    def _get_default_sentiment(self):
        return {
            "overallSentiment": "neutral",
            "score": 0.5,
            "emotions": [],
            "intensity": 0.5
        }
    
    def _get_default_actions(self):
        return {
            "actions": [{"description": "Review ticket manually"}]
        }
    
    def _get_default_routing(self):
        return {
            "recommendedTeam": "technical-support",
            "confidence": 0.5
        }
    
    def _get_default_time_estimation(self):
        return {
            "estimatedMinutes": 30,
            "confidence": 0.5
        }
    
    def _get_default_recommendations(self):
        return {
            "suggestedResolutions": [{
                "steps": ["Please try again later"],
                "confidence": 0.5
            }]
        }
    
    def _get_fallback_results(self, error_message):
        """Get fallback results when the entire process fails"""
        return {
            "error": error_message,
            "summary": self._get_default_summary(),
            "sentiment": self._get_default_sentiment(),
            "actions": self._get_default_actions(),
            "routing": self._get_default_routing(),
            "timeEstimation": self._get_default_time_estimation(),
            "recommendations": self._get_default_recommendations()
        }
