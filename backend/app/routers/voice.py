from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from ..database.session import get_db
from ..schemas.voice_analysis import AnalysisResponse, AnalysisCreate
from ..models.user import User
from ..routers.deps import get_current_user
from ..services.voice_service import VoiceService
import shutil
import os
import uuid

router = APIRouter(
    tags=["voice"]
)


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_file(
    file: UploadFile = File(...),
    language: str = Form("Unknown"),
    audio_format: str = Form("mp3"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in [".mp3", ".wav"]:
        raise HTTPException(status_code=400, detail="Only .mp3 and .wav files are supported")
    
    from ..services.voice_service import TEMP_DIR, VoiceService
    temp_filename = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(TEMP_DIR, temp_filename)
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        result = await VoiceService.analyze_audio_file(db, temp_path, current_user.id, filename, language)
        return result

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(
    page: int = 1,
    limit: int = 10,
    language: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    skip = (page - 1) * limit
    items, total = await VoiceService.get_user_history(db, current_user.id, skip, limit, language)
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit
    }
