
import requests
from flask import jsonify
import traceback

def check_ollama_connection(ollama_url, data_loader):
    """Check if Ollama is accessible and return status information"""
    try:
        print(f"Checking Ollama connection at {ollama_url}")
        # Check if Ollama is accessible
        response = requests.get(f"{ollama_url}/api/tags", timeout=5)
        
        if response.status_code == 200:
            models = response.json().get('models', [])
            print(f"Ollama connected successfully, found {len(models)} models")
            return jsonify({
                "status": "ok",
                "ollama_connected": True,
                "models": models,
                "historical_tickets": len(data_loader.historical_tickets),
                "conversations": len(data_loader.conversations)
            })
        else:
            print(f"Ollama API returned status code {response.status_code}")
            return jsonify({
                "status": "warning",
                "ollama_connected": False,
                "message": f"Ollama API returned status code {response.status_code}"
            })
    except Exception as e:
        print(f"Error connecting to Ollama: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "status": "error",
            "ollama_connected": False,
            "message": str(e)
        }), 500
