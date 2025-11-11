# Backend Setup and Run (Windows)
# Church Treasury System

Write-Host "🏗️  Setting up Church Treasury Backend..." -ForegroundColor Cyan

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python 3 is not installed. Please install Python 3.9 or higher." -ForegroundColor Red
    exit 1
}

# Check if Tesseract is installed
if (!(Get-Command tesseract -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Tesseract OCR is not installed." -ForegroundColor Red
    Write-Host "Please download and install from: https://github.com/UB-Mannheim/tesseract/wiki"
    exit 1
}

Write-Host "✅ Python and Tesseract found" -ForegroundColor Green

# Create virtual environment if it doesn't exist
if (!(Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔌 Activating virtual environment..." -ForegroundColor Cyan
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📥 Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

# Create uploads directory if it doesn't exist
if (!(Test-Path "uploads")) {
    New-Item -ItemType Directory -Path "uploads" | Out-Null
}

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Starting FastAPI server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "📝 Default admin credentials: username=admin, password=admin123" -ForegroundColor Yellow
Write-Host ""

# Run the server
python main.py
