"""
Routes
------
API routes for the Agile AI Support Desk application.
"""

from flask import jsonify, request
from flask_cors import CORS
from agent_service import AgentService
import traceback

def register_routes(app, data_loader, OLLAMA_URL, DEFAULT_MODEL):
    """Register all routes for the application"""
    
    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Initialize the agent service
    agent_service = AgentService(OLLAMA_URL, DEFAULT_MODEL)
    
    @app.route('/', methods=['GET'])
    def index():
        """Root endpoint for basic connectivity check"""
        return jsonify({
            "status": "ok",
            "message": "AI Customer Support System Backend API is running",
            "endpoints": ["/status", "/historical-data", "/conversations", "/process-ticket", "/tickets"]
        })

    @app.route('/status', methods=['GET'])
    def status():
        """Check if the backend server is running and can connect to Ollama"""
        from ollama_service import check_ollama_connection
        return check_ollama_connection(OLLAMA_URL, data_loader)

    @app.route('/historical-data', methods=['GET'])
    def get_historical_data():
        """Return all historical ticket data"""
        return jsonify(data_loader.historical_tickets)

    @app.route('/conversations', methods=['GET'])
    def get_conversations():
        """Return all conversation examples"""
        return jsonify(data_loader.conversations)

    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({"status": "healthy"})

    @app.route('/process-ticket', methods=['POST'])
    def process_ticket():
        """Process a ticket using the multi-agent framework"""
        try:
            # Get ticket data from request
            ticket = request.json.get('ticket')
            if not ticket:
                return jsonify({"error": "No ticket data provided"}), 400
            
            # Get historical context if available
            historical_context = request.json.get('historical_context')
            
            # Process the ticket using the agent service
            results = agent_service.process_ticket(ticket, historical_context)
            
            # Check if there was an error
            if "error" in results:
                print(f"Error from agent service: {results['error']}")
                return jsonify(results), 500
            else:
                # Print success
                print(f"Successfully processed ticket {ticket['id']}")
                return jsonify(results)
            
        except Exception as e:
            print(f"Error processing ticket: {str(e)}")
            print(traceback.format_exc())
            return jsonify({
                "error": str(e),
                "summary": {"keyPoints": ["Error processing ticket"]},
                "sentiment": {"overallSentiment": "neutral", "score": 0.5},
                "actions": {"actions": [{"description": "Review ticket manually"}]},
                "routing": {"recommendedTeam": "technical-support"},
                "timeEstimation": {"estimatedMinutes": 30},
                "recommendations": {"suggestedResolutions": [{"steps": ["Please try again later"], "confidence": 0.5}]}
            }), 500

    @app.route('/tickets', methods=['GET'])
    def get_tickets():
        """Get all tickets"""
        try:
            tickets = data_loader.get_tickets()
            return jsonify(tickets)
        except Exception as e:
            print(f"Error getting tickets: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/tickets', methods=['POST'])
    def create_ticket():
        """Create a new ticket"""
        try:
            ticket_data = request.json
            if not ticket_data:
                return jsonify({"error": "No ticket data provided"}), 400
                
            # Validate required fields
            required_fields = ['subject', 'description', 'customerName', 'category', 'priority']
            missing_fields = [field for field in required_fields if field not in ticket_data]
            if missing_fields:
                return jsonify({
                    "error": f"Missing required fields: {', '.join(missing_fields)}"
                }), 400
                
            # Create the ticket
            new_ticket = data_loader.create_ticket(ticket_data)
            
            return jsonify(new_ticket), 201
        except Exception as e:
            print(f"Error creating ticket: {str(e)}")
            print(traceback.format_exc())
            return jsonify({"error": str(e)}), 500

    @app.route('/tickets/<ticket_id>', methods=['GET'])
    def get_ticket(ticket_id):
        """Get a specific ticket"""
        try:
            ticket = data_loader.get_ticket(ticket_id)
            if ticket:
                return jsonify(ticket)
            else:
                return jsonify({"error": f"Ticket {ticket_id} not found"}), 404
        except Exception as e:
            print(f"Error getting ticket {ticket_id}: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/tickets/<ticket_id>/history', methods=['GET'])
    def get_ticket_history(ticket_id):
        """Get ticket history"""
        try:
            history = data_loader.get_ticket_history(ticket_id)
            if history:
                return jsonify(history)
            else:
                return jsonify({"error": f"History for ticket {ticket_id} not found"}), 404
        except Exception as e:
            print(f"Error getting ticket history {ticket_id}: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/knowledge-base', methods=['GET'])
    def get_knowledge_base():
        """Get knowledge base articles"""
        try:
            articles = data_loader.get_knowledge_base()
            return jsonify(articles)
        except Exception as e:
            print(f"Error getting knowledge base: {str(e)}")
            return jsonify({"error": str(e)}), 500

    @app.route('/knowledge-base/<article_id>', methods=['GET'])
    def get_knowledge_base_article(article_id):
        """Get a specific knowledge base article"""
        try:
            article = data_loader.get_knowledge_base_article(article_id)
            if article:
                return jsonify(article)
            else:
                return jsonify({"error": f"Article {article_id} not found"}), 404
        except Exception as e:
            print(f"Error getting article {article_id}: {str(e)}")
            return jsonify({"error": str(e)}), 500
