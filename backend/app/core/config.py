from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "VoxVerify"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost/voxverify"
    
    # Security
    SECRET_KEY: str = "supersecretkey" # Override in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
