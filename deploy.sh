@ -0,0 +1,108 @@
#!/bin/bash

# Quick Deploy Script for Treasury System
# This script builds the frontend and prepares for deployment

echo "🚀 Treasury System - Quick Deploy Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the treasury_system directory${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Verifying all fixes are in place...${NC}"
./verify_fixes.sh
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Verification failed. Please check the errors above.${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Installing frontend dependencies...${NC}"
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}Step 3: Building frontend for production...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

cd ..

echo -e "${BLUE}Step 4: Checking backend Python dependencies...${NC}"
cd backend
if command -v python3 &> /dev/null; then
    PYTHON_CMD=python3
elif command -v python &> /dev/null; then
    PYTHON_CMD=python
else
    echo -e "${RED}❌ Python not found${NC}"
    exit 1
fi

echo "Using Python: $PYTHON_CMD"
$PYTHON_CMD -m pip install -r requirements.txt --quiet
echo -e "${GREEN}✅ Backend dependencies checked${NC}"
echo ""

cd ..

echo "=========================================="
echo -e "${GREEN}🎉 Build Complete!${NC}"
echo ""
echo "📦 Deployment files ready:"
echo "  • Frontend: frontend/dist/"
echo "  • Backend: backend/"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. ${YELLOW}Commit and push to Git:${NC}"
echo "   git add ."
echo "   git commit -m 'Fix: Resolve dashboard issues (undefined username, missing receipts, admin details)'"
echo "   git push origin main"
echo ""
echo "2. ${YELLOW}If auto-deploy is enabled:${NC}"
echo "   • Wait for your hosting service to deploy"
echo "   • Check deployment logs for errors"
echo ""
echo "3. ${YELLOW}If deploying manually:${NC}"
echo "   • Upload frontend/dist/* to your web server"
echo "   • Upload backend/*.py to your backend server"
echo "   • Restart your backend service"
echo ""
echo "4. ${YELLOW}After deployment:${NC}"
echo "   • Clear your browser cache (Ctrl+Shift+Delete)"
echo "   • Open https://necftreausry.com/admin"
echo "   • Check the browser console (F12) for logs"
echo "   • Verify username shows correctly"
echo "   • Verify receipts are loading"
echo ""
echo "5. ${YELLOW}Test checklist:${NC}"
echo "   ✓ Login works"
echo "   ✓ Username displays correctly (not 'undefined')"
echo "   ✓ Receipts appear in dashboard"
echo "   ✓ Statistics show correct numbers"
echo "   ✓ Admin management works (if superuser)"
echo ""
echo "📚 For detailed instructions, see: CRITICAL_FIXES_DEC2025.md"
echo ""