from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from app.services.judge0_service import judge0_service
from app.services.ai_service import ai_service
from app.api.deps import get_current_user
from app.models.user import User, ScanHistory
from typing import Optional

router = APIRouter()

class DebugRequest(BaseModel):
    code: str
    language: str
    manual_ai: Optional[bool] = False

@router.post("/analyze")
async def analyze_code(request: DebugRequest, user: Optional[User] = Depends(get_current_user)):
    # 1. Execute code via Judge0
    execution_result = await judge0_service.execute_code(request.code, request.language)
    
    if "error" in execution_result:
        # If Judge0 service itself fails
        ai_report = await ai_service.analyze_code(request.code, request.language)
        return {
            "execution": execution_result,
            "ai_report": ai_report
        }

    # 2. Determine if AI analysis is needed
    # We trigger AI if there's a compilation error (6), runtime error (7-12), or if user requested manual check
    has_error = execution_result.get("status_id") and execution_result.get("status_id") >= 6
    
    ai_report = None
    if has_error or request.manual_ai:
        error_msg = execution_result.get("compile_output") or execution_result.get("stderr") or execution_result.get("message")
        ai_report = await ai_service.analyze_code(request.code, request.language, error_msg)

    # 3. Save to history if user is logged in
    if user:
        scan = ScanHistory(
            user_id=str(user.id),
            language=request.language,
            input_type="manual",
            original_code=request.code,
            detected_errors=[ai_report] if ai_report else []
        )
        await scan.insert()

    return {
        "execution": execution_result,
        "ai_report": ai_report
    }

@router.post("/ocr")
async def ocr_code(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_bytes = await file.read()
    result = await ai_service.extract_code_from_image(image_bytes)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result
