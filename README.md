# VoxVerify - AI Voice Authenticity Detection Platform

VoxVerify is a modern web platform designed to detect AI-generated voices. It features a FastAPI backend with integrated ML analysis (Librosa/Sklearn) and an Angular frontend with a sleek, "Serious Tech" design.

## Features
-   **Voice Analysis**: Upload `.mp3` or `.wav` files to detect if they are HUMAN or AI-GENERATED.
-   **Secure Authentication**: JWT-based login and registration.
-   **Modern UI**: Responsive dashboard with drag-and-drop upload and animated results.
-   **History**: Track all your past analyses.

## Quick Start from Root

### 1. Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Ensure PostgreSQL is running on localhost:5432
uvicorn app.main:app --reload
```

### 2. Frontend
```powershell
cd frontend
npm install
npm start
```

## Documentation
See [walkthrough.md](walkthrough.md) for detailed setup and usage instructions.
