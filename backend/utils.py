import requests
import json
import traceback

def call_ollama_agent(prompt, system="", model="llama3:8b", ollama_url="http://localhost:11434"):
    """Call Ollama API with the given prompt and system message"""
    try:
        print(f"Calling Ollama API with model: {model}")
        print(f"System prompt: {system}")
        print(f"User prompt: {prompt[:100]}...")  # Print first 100 chars of prompt
        
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "system": system,
                "stream": False
            },
            timeout=60  # Add a reasonable timeout
        )
        
        if response.status_code == 200:
            result = response.json().get("response", "")
            # Attempt to parse as JSON if it looks like JSON
            if result.strip().startswith("{") and result.strip().endswith("}"):
                try:
                    return json.loads(result)
                except:
                    pass
            return {"text": result}
        else:
            error_msg = f"Ollama API returned status code {response.status_code}"
            print(error_msg)
            return {"error": error_msg}
    except Exception as e:
        print(f"Error calling Ollama API: {str(e)}")
        print(traceback.format_exc())
        return {"error": str(e)}
