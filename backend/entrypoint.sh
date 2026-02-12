#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
alembic upgrade head

# Start application
echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
