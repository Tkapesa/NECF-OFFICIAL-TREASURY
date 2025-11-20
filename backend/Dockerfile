# Use Python 3.11 slim so compiled packages like Pillow build reliably
FROM python:3.11-slim

# Install system packages needed for Pillow, Tesseract and common builds
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Copy backend files
COPY . .

# Upgrade pip then install python deps
RUN python -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

ENV PORT=8000

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:$PORT", "--workers", "2"]
