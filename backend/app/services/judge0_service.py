import httpx
from app.core.config import settings

# Mapping our language IDs to Judge0 language IDs
LANGUAGE_MAP = {
    "python": 71,      # Python 3.8.1
    "javascript": 63,  # Node.js 12.14.0
    "cpp": 54,        # C++ (GCC 9.2.0)
    "java": 62,       # Java (OpenJDK 13.0.1)
    "c": 50,          # C (GCC 9.2.0)
    "csharp": 51,     # C# (Mono 6.6.0.161)
    "php": 68,        # PHP (7.4.1)
    "go": 60,         # Go (1.13.5)
    "sql": 82,        # SQL (SQLite 3.31.1)
}

class Judge0Service:
    def __init__(self):
        self.api_url = settings.JUDGE0_API_URL
        self.headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": settings.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }

    async def execute_code(self, source_code: str, language_id_str: str):
        lang_id = LANGUAGE_MAP.get(language_id_str.lower())
        if not lang_id:
            return {"error": f"Language {language_id_str} not supported by Judge0"}

        payload = {
            "source_code": source_code,
            "language_id": lang_id,
            "stdin": ""
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                # Create submission
                response = await client.post(
                    f"{self.api_url}/submissions",
                    json=payload,
                    headers=self.headers,
                    params={"base64_encoded": "false", "wait": "true"}
                )
                
                result = response.json()
                
                return {
                    "stdout": result.get("stdout"),
                    "stderr": result.get("stderr"),
                    "compile_output": result.get("compile_output"),
                    "message": result.get("message"),
                    "status": result.get("status", {}).get("description"),
                    "status_id": result.get("status", {}).get("id"),
                    "time": result.get("time"),
                    "memory": result.get("memory")
                }
                
        except Exception as e:
            return {"error": str(e)}

judge0_service = Judge0Service()
