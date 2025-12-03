#!/bin/bash

# Quick Verification Script for Treasury System Fixes
# Run this after deploying to verify all fixes are working

echo "🔍 Treasury System - Fix Verification Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for passed/failed checks
PASSED=0
FAILED=0

echo "📋 Checking Frontend Files..."
echo ""

# Check if AdminDashboard.jsx has the fix
if grep -q "savedUsername && savedUsername !== 'null' && savedUsername !== 'undefined'" frontend/src/pages/AdminDashboard.jsx; then
    echo -e "${GREEN}✅ Username fix is present in AdminDashboard.jsx${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Username fix is missing in AdminDashboard.jsx${NC}"
    ((FAILED++))
fi

# Check if enhanced error handling exists in fetchReceipts
if grep -q "console.log('Fetching receipts from API...');" frontend/src/pages/AdminDashboard.jsx; then
    echo -e "${GREEN}✅ Enhanced error handling in fetchReceipts${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Enhanced error handling missing in fetchReceipts${NC}"
    ((FAILED++))
fi

# Check if AdminManagement has enhanced logging
if grep -q "console.log('Fetching admins from API...');" frontend/src/components/AdminManagement.jsx; then
    echo -e "${GREEN}✅ Enhanced logging in AdminManagement${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Enhanced logging missing in AdminManagement${NC}"
    ((FAILED++))
fi

echo ""
echo "📋 Checking Backend Files..."
echo ""

# Check if CORS includes www subdomain
if grep -q "https://www.necftreausry.com" backend/main.py; then
    echo -e "${GREEN}✅ CORS configuration includes www subdomain${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  CORS might be missing www subdomain${NC}"
    ((FAILED++))
fi

# Check if receipts endpoint has error handling
if grep -q "except Exception as e:" backend/main.py && grep -q "get_receipts" backend/main.py; then
    echo -e "${GREEN}✅ Enhanced error handling in receipts endpoint${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Enhanced error handling missing in receipts endpoint${NC}"
    ((FAILED++))
fi

# Check if admins endpoint has logging
if grep -q "print(f\"👤 User" backend/main.py; then
    echo -e "${GREEN}✅ Enhanced logging in admins endpoint${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ Enhanced logging missing in admins endpoint${NC}"
    ((FAILED++))
fi

echo ""
echo "📋 Checking Configuration Files..."
echo ""

# Check if .env.production exists
if [ -f "frontend/.env.production" ]; then
    echo -e "${GREEN}✅ Production environment file exists${NC}"
    ((PASSED++))
    
    # Check if it has the correct API URL
    if grep -q "VITE_API_URL=https://necftreausry.com/api" frontend/.env.production; then
        echo -e "${GREEN}✅ Production API URL is correctly configured${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  Production API URL might be incorrect${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}❌ Production environment file missing${NC}"
    ((FAILED++))
fi

echo ""
echo "=============================================="
echo "📊 Verification Results:"
echo ""
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready to deploy.${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some checks failed. Review the issues above before deploying.${NC}"
    exit 1
fi
