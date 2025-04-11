from flask import Flask
from flask_cors import CORS
import os
from data_loader import DataLoader
from routes import register_routes

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS with more specific settings
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

print(f"Using Ollama URL: {OLLAMA_URL}")
print(f"Default model: {DEFAULT_MODEL}")

# Initialize data loader
data_loader = DataLoader()

# Register all routes
register_routes(app, data_loader, OLLAMA_URL, DEFAULT_MODEL)

if __name__ == '__main__':
    print("Starting AI Customer Support System Backend...")
    print("Make sure Ollama is running with the llama3 model loaded")
    print("To load the model, run: ollama pull llama3")
    app.run(debug=True, host='0.0.0.0', port=5000)
