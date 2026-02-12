from sqlalchemy.ext.asyncio import AsyncSession
from ..models.voice_analysis import VoiceAnalysis
from ..schemas.voice_analysis import AnalysisCreate
from ..ml.voice_model_loader import predict_audio_async
import base64
import os
import uuid
import shutil

TEMP_DIR = "temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

class VoiceService:
    @staticmethod
    async def analyze_audio_file(db: AsyncSession, file_path: str, user_id: int, original_filename: str, language: str = "Unknown"):
        try:
            # Predict
            result = await predict_audio_async(file_path)
            
            if "error" in result:
                raise Exception(result["error"])

            db_analysis = VoiceAnalysis(
                user_id=user_id,
                filename=original_filename,
                language=language,
                classification=result["classification"],
                confidence_score=result["confidence_score"],
                explanation=result["explanation"]
            )
            db.add(db_analysis)
            await db.commit()
            await db.refresh(db_analysis)
            return db_analysis
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

    @staticmethod
    async def analyze_base64(db: AsyncSession, data: AnalysisCreate, user_id: int):
        try:
             # Remove header if present
            if "," in data.audio_base64:
                _, encoded = data.audio_base64.split(",", 1)
            else:
                encoded = data.audio_base64
            
            decoded_bytes = base64.b64decode(encoded)
        except Exception:
            raise Exception("Invalid Base64 string")

        # Use provided format extension or default to mp3
        # In a real app we might inspect magic bytes
        ext = ".mp3"
        # Since AnalysisBase has no 'audioFormat' field yet, we rely on filename or default
        if data.filename.endswith(".wav"):
            ext = ".wav"
        
        temp_filename = f"{uuid.uuid4()}{ext}"
        temp_path = os.path.join(TEMP_DIR, temp_filename)
        
        try:
            with open(temp_path, "wb") as f:
                f.write(decoded_bytes)
                
            # Predict
            result = await predict_audio_async(temp_path)
            
            if "error" in result:
                raise Exception(result["error"])

            db_analysis = VoiceAnalysis(
                user_id=user_id,
                filename=data.filename,
                language=data.language or "Unknown",
                classification=result["classification"],
                confidence_score=result["confidence_score"],
                explanation=result["explanation"]
            )
            db.add(db_analysis)
            await db.commit()
            await db.refresh(db_analysis)
            return db_analysis

        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

    @staticmethod
    async def get_user_history(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 10, language: str = None):
        from sqlalchemy import select, func
        
        query = select(VoiceAnalysis).where(VoiceAnalysis.user_id == user_id)
        
        if language:
            query = query.where(VoiceAnalysis.language == language)
            
        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total = await db.scalar(count_query)
        
        # Get items
        query = query.order_by(VoiceAnalysis.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        items = result.scalars().all()
        
        return items, total
