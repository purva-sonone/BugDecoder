import google.generativeai as genai
from app.core.config import settings
import json
import PIL.Image
import io

class AIService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using JSON mode for faster and more reliable parsing
        self.model = genai.GenerativeModel(
            'gemini-1.5-flash',
            generation_config={"response_mime_type": "application/json"}
        )

    async def analyze_code(self, code: str, language: str, error_message: str = None):
        prompt = f"""
        You are an expert coding mentor. Analyze this {language} code.
        {f"Error: {error_message}" if error_message else "Task: Logic check and optimization."}
        
        Code:
        {code}
        
        Return JSON:
        {{
            "status": "error" | "optimization",
            "line_number": int,
            "explanation": "short beginner-friendly string",
            "suggested_fix": "code snippet",
            "full_code": "entire fixed file",
            "mentor_tip": "short tip"
        }}
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            error_str = str(e)
            explanation = f"Failed to analyze code: {error_str}"
            
            if "429" in error_str:
                explanation = "AI is currently busy (Rate Limit Reached). Please wait about 30-60 seconds and try again."
            
            return {
                "status": "error",
                "line_number": 0,
                "explanation": explanation,
                "suggested_fix": "",
                "full_code": code
            }

    async def extract_code_from_image(self, image_bytes: bytes):
        try:
            image = PIL.Image.open(io.BytesIO(image_bytes))
            
            prompt = """
            Extract all the programming code from this image. 
            - Identify the programming language.
            - Maintain the exact indentation and structure.
            - Clean up any OCR noise or misread characters.
            - Return ONLY the raw code, no explanations or markdown blocks.
            """
            
            response = self.model.generate_content([prompt, image])
            return {
                "success": True,
                "code": response.text.strip(),
                "detected_language": "auto" # We can add more logic to detect language if needed
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to process image: {str(e)}"
            }

ai_service = AIService()
