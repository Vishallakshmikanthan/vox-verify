import joblib
import os
import numpy as np
from .feature_extractor import extract_features

# Load model relative to this file
MODEL_PATH = os.path.join(os.path.dirname(__file__), "voice_model.pkl")

_model = None

def get_model():
    global _model
    if _model is None:
        try:
            _model = joblib.load(MODEL_PATH)
            print(f"Model loaded from {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")
            _model = None
    return _model

def predict_audio(file_path):
    """
    Predicts if the audio at file_path is HUMAN (1) or AI (0).
    Returns dictionary with classification, confidence, and explanation.
    """
    model = get_model()
    if model is None:
        return {"error": "Model not loaded"}

    try:
        features = extract_features(file_path)
        # Reshape for single sample prediction
        features = features.reshape(1, -1)
        
        # Predict class and probability
        prediction = model.predict(features)[0]
        # Check if the model supports predict_proba
        try:
            probabilities = model.predict_proba(features)[0]
            confidence = float(np.max(probabilities))
        except AttributeError:
            confidence = 0.0 # Fallback if model doesn't support probability
        
        result_label = "HUMAN" if prediction == 1 else "AI_GENERATED"
        
        return {
            "classification": result_label,
            "confidence_score": confidence,
            "explanation": f"The model is {confidence:.2%} confident this is {result_label} speech based on acoustic features (MFCC, Spectral, etc.)."
        }
    except Exception as e:
        return {"error": str(e)}
