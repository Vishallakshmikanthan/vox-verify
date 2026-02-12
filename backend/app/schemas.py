from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Analysis Schemas
class AnalysisBase(BaseModel):
    filename: str
    language: Optional[str] = None

class AnalysisCreate(AnalysisBase):
    audio_base64: str

class AnalysisResponse(AnalysisBase):
    id: int
    classification: str
    confidence_score: float
    explanation: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
