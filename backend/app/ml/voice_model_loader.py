import joblib
import os
import numpy as np
import asyncio
from concurrent.futures import ThreadPoolExecutor
from .feature_extractor import extract_features

# Load model relative to this file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "voice_model.pkl")

_model = None
_executor = ThreadPoolExecutor(max_workers=1)

def get_model():
    global _model
    if _model is None:
        try:
            if os.path.exists(MODEL_PATH):
                _model = joblib.load(MODEL_PATH)
                print(f"Model loaded from {MODEL_PATH}")
            else:
                print(f"Model file not found at {MODEL_PATH}")
                _model = None
        except Exception as e:
            print(f"Error loading model: {e}")
            _model = None
    return _model

def _predict_sync(file_path):
    model = get_model()
    if model is None:
        return {"error": "Model not loaded"}

    try:
        features = extract_features(file_path)
        features = features.reshape(1, -1)
        
        prediction = model.predict(features)[0]
        try:
            probabilities = model.predict_proba(features)[0]
            confidence = float(np.max(probabilities))
        except AttributeError:
            confidence = 0.0
        
        result_label = "HUMAN" if prediction == 1 else "AI_GENERATED"
        
        return {
            "classification": result_label,
            "confidence_score": confidence,
            "explanation": f"The model is {confidence:.2%} confident this is {result_label} speech."
        }
    except Exception as e:
        return {"error": str(e)}

async def predict_audio_async(file_path):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, _predict_sync, file_path)
