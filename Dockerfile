# Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --no-audit --no-fund

# Copy source and build
COPY frontend/ .
RUN npm run build

# Backend runtime
FROM python:3.11-slim
WORKDIR /app

# System deps for OCR
RUN apt-get update \
    && apt-get install -y --no-install-recommends tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend deps
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy built frontend assets
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

ENV SERVE_FRONTEND=1
ENV FRONTEND_DIST=/app/frontend/dist

WORKDIR /app/backend

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
