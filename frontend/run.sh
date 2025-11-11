#!/bin/bash
# Frontend setup and run script for Church Treasury System

echo "🎨 Setting up Church Treasury Frontend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📥 Installing npm dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "🚀 Starting Vite development server on http://localhost:5173"
echo ""

# Run the dev server
npm run dev
