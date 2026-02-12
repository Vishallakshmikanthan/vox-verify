from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, voice
from .database.session import engine
from .database.base import Base
from .core.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# Create tables on startup (For MVP - usually Alembic is used)
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:4200",
    "https://voxverify.vercel.app",  # Production Frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_origin_regex="https://.*\.vercel\.app", # Allow all Vercel deployments (previews + prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(voice.router, prefix="/api/voice")

@app.get("/")
def read_root():
    return {"message": "Welcome to VoxVerify API"}
