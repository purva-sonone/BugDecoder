from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
import asyncio
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
    # If manual_ai is true, we can start both tasks in parallel
    if request.manual_ai:
        # Run both in parallel
        execution_task = judge0_service.execute_code(request.code, request.language)
        ai_task = ai_service.analyze_code(request.code, request.language)
        
        execution_result, ai_report = await asyncio.gather(execution_task, ai_task)
    # Standard flow: Run both in parallel to avoid blocking
    execution_task = judge0_service.execute_code(request.code, request.language)
    ai_task = ai_service.analyze_code(request.code, request.language)
    
    execution_result, ai_report = await asyncio.gather(execution_task, ai_task)

    # 3. Save to history if user is logged in
    if user:
        scan = ScanHistory(
            user_id=str(user.id),
            language=request.language,
            input_type="manual" if request.manual_ai else "auto",
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
