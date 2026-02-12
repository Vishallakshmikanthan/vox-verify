from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AnalysisBase(BaseModel):
    filename: str
    language: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    audio_base64: str
    audioFormat: Optional[str] = "mp3"

class AnalysisResponse(AnalysisBase):
    id: int
    classification: str
    confidence_score: float
    explanation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
