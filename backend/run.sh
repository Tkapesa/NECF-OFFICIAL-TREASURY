#!/bin/bash
# Backend setup and run script for Church Treasury System

echo "🏗️  Setting up Church Treasury Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Tesseract is installed
if ! command -v tesseract &> /dev/null; then
    echo "⚠️  Warning: Tesseract OCR is not installed."
    echo "OCR features will not work until Tesseract is installed:"
    echo "  macOS: brew install tesseract"
    echo "  Ubuntu: sudo apt-get install tesseract-ocr"
    echo ""
    echo "Continuing without Tesseract..."
fi

echo "✅ Python and Tesseract found"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Create uploads directory if it doesn't exist
mkdir -p uploads

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📝 Default admin credentials: username=admin, password=admin123"
echo ""

# Run the server
python main.py
