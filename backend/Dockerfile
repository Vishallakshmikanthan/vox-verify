# Base Image
FROM python:3.10-slim

# System Dependencies (libsndfile for librosa, ffmpeg for audio, gcc for compilation)
RUN apt-get update && apt-get install -y \
    gcc \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Work Directory
WORKDIR /app

# Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application Code
COPY . .

# Set permissions for entrypoint
RUN chmod +x entrypoint.sh

# Environment
ENV PYTHONPATH=/app

# Expose Port
EXPOSE 8000

# Run Command via entrypoint
CMD ["./entrypoint.sh"]
