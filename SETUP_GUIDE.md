# Complete Setup and Run Instructions
# Church Treasury System

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Environment Configuration](#environment-configuration)
5. [Example Usage](#example-usage)
6. [Troubleshooting](#troubleshooting)
7. [Production Deployment](#production-deployment)

---

## 🔧 Prerequisites

### Required Software

#### 1. Python 3.10 or Higher
```bash
# Check Python version
python3 --version
# Should output: Python 3.10.x or higher

# Install Python if needed:
# macOS
brew install python@3.10

# Ubuntu/Debian
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip

# Windows
# Download from https://www.python.org/downloads/
```

#### 2. Node.js 18 or Higher
```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Install Node.js if needed:
# macOS
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
```

#### 3. Tesseract OCR
```bash
# Check Tesseract installation
tesseract --version
# Should output: tesseract 4.x.x or higher

# Install Tesseract:
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt update
sudo apt install tesseract-ocr

# Windows
# Download installer from:
# https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH after installation
```

### Optional Tools
- **Git** - For version control
- **VS Code** - Recommended editor
- **Postman/Insomnia** - For API testing

---

## 📦 Installation Steps

### Step 1: Clone or Download the Project

```bash
cd /path/to/your/projects
# If using git:
git clone <repository-url> church-treasury
cd church-treasury

# Or extract the downloaded zip file and cd into it
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Python Virtual Environment
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows (Command Prompt):
venv\Scripts\activate.bat

# Windows (PowerShell):
venv\Scripts\Activate.ps1
```

You should see `(venv)` prefix in your terminal.

#### 2.3 Install Python Dependencies
```bash
# Ensure venv is activated (you should see (venv) prefix)
pip install --upgrade pip
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.104.1 uvicorn-0.24.0 sqlalchemy-2.0.23 ...
```

#### 2.4 Create .env File (Optional)
```bash
# Copy example environment file
cp ../.env.example .env

# Edit .env with your preferred editor
nano .env
# or
code .env
```

**Important:** Change the JWT secret key in production!

#### 2.5 Verify Installation
```bash
# Test imports
python -c "import fastapi; import pytesseract; print('✓ All imports successful')"
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory
```bash
# From backend directory:
cd ../frontend

# Or from project root:
cd frontend
```

#### 3.2 Install Node Dependencies
```bash
npm install
```

**Expected output:**
```
added XXX packages in Xs
```

#### 3.3 Verify Installation
```bash
# Check if node_modules was created
ls node_modules

# Test build (optional)
npm run build
```

---

## 🚀 Running the Application

### Option 1: Quick Start with Scripts (Recommended)

#### Terminal 1 - Backend
```bash
cd backend
./run.sh
```

#### Terminal 2 - Frontend
```bash
cd frontend
./run.sh
```

**Windows Users:**
```powershell
# Backend
cd backend
.\run.ps1

# Frontend
cd frontend
npm install
npm run dev
```

### Option 2: Manual Start

#### Terminal 1 - Start Backend Server

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate.bat  # Windows

# Run FastAPI server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Alternative: Use Python directly
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
Default admin created: username=admin, password=admin123
INFO:     Application startup complete.
```

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend

# Start Vite dev server
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

### Verification

✅ **Backend running:** http://localhost:8000
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/

✅ **Frontend running:** http://localhost:5173
- User upload: http://localhost:5173/
- Admin dashboard: http://localhost:5173/admin

---

## ⚙️ Environment Configuration

### Backend Configuration

Create `backend/.env` from `.env.example`:

```bash
cp .env.example backend/.env
```

**Key configuration options:**

```bash
# Security
JWT_SECRET_KEY=your-very-long-random-secret-key-here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=sqlite:///./treasury.db

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# CORS
CORS_ORIGINS=http://localhost:5173

# Admin Seed
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
```

### Generating a Secure JWT Secret

```bash
# Option 1: Using OpenSSL
openssl rand -hex 32

# Option 2: Using Python
python -c "import secrets; print(secrets.token_hex(32))"

# Copy the output and paste into .env
```

### Frontend Configuration (Optional)

If you need to configure the API URL:

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:8000
```

Update `frontend/src/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});
```

---

## 📖 Example Usage

### 1. First Time Setup

#### A. Backend Initialization
```bash
cd backend
source venv/bin/activate
python main.py
```

**What happens:**
- ✅ Creates `treasury.db` SQLite database
- ✅ Creates `admins` and `receipts` tables
- ✅ Seeds default admin (username: admin, password: admin123)
- ✅ Creates `uploads/` directory
- ✅ Starts server on port 8000

#### B. Frontend Startup
```bash
cd frontend
npm run dev
```

**What happens:**
- ✅ Starts Vite dev server
- ✅ Opens http://localhost:5173
- ✅ Hot reload enabled

### 2. User Receipt Upload Flow

#### Step-by-Step:

1. **Open browser:** http://localhost:5173

2. **You'll see the upload page** with:
   - Church Treasury System header (maroon)
   - "Submit Your Receipt" title
   - Upload form

3. **Fill in the form:**
   ```
   Receipt Image: [Choose File] → Select any receipt image
   Your Name: John Doe
   Phone Number: +1-234-567-8900
   Item Bought: Office Supplies - Printer Paper
   Approved By: Pastor Smith
   ```

4. **Click "Submit Receipt"**

5. **What happens:**
   - Image uploads to `backend/uploads/`
   - OCR runs automatically
   - Extracts price, date, time
   - Saves to database
   - Shows success message

6. **Success message:**
   ```
   ✓ Receipt uploaded successfully
   Receipt ID: 1
   OCR Data: Price: $24.99, Date: 2025-11-09, Time: 14:30
   ```

### 3. Admin Login and Management

#### Step-by-Step:

1. **Navigate to admin:** http://localhost:5173/admin

2. **Login dialog appears:**
   ```
   Username: admin
   Password: admin123
   ```

3. **Click "Login"**

4. **Dashboard loads showing:**
   - All receipts in a table
   - Image thumbnails
   - User information
   - OCR extracted data (editable)

5. **Edit OCR data:**
   - Click on any OCR field (Price, Date, Time)
   - Field becomes editable
   - Modify the value
   - Click save icon (💾)
   - Data updates in database

6. **View full receipt image:**
   - Click on image thumbnail
   - Opens in new tab

### 4. API Testing Example

#### Using curl:

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -F "username=admin" \
  -F "password=admin123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Upload Receipt:**
```bash
curl -X POST http://localhost:8000/api/receipts/upload \
  -F "image=@receipt.jpg" \
  -F "user_name=John Doe" \
  -F "user_phone=+1234567890" \
  -F "item_bought=Office Supplies" \
  -F "approved_by=Pastor Smith"
```

**Get All Receipts (Protected):**
```bash
TOKEN="your_token_here"
curl http://localhost:8000/api/receipts \
  -H "Authorization: Bearer $TOKEN"
```

**Update Receipt (Protected):**
```bash
curl -X PUT http://localhost:8000/api/receipts/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ocr_price": 29.99, "ocr_date": "2025-11-09", "ocr_time": "15:00"}'
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Tesseract Not Found

**Error:**
```
pytesseract.pytesseract.TesseractNotFoundError
```

**Solutions:**

**macOS:**
```bash
brew install tesseract
# Verify
which tesseract
tesseract --version
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

**Windows:**
```powershell
# After installing from https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH or set in code:
```

Edit `backend/ocr_utils.py`:
```python
import pytesseract
# Add this line at the top
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

#### 2. Port Already in Use

**Error:**
```
Address already in use: 8000 (or 5173)
```

**Solution:**

**Find and kill process (macOS/Linux):**
```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

**Windows:**
```powershell
# Find process
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Or use different ports:**
```bash
# Backend
uvicorn main:app --port 8001

# Frontend
npm run dev -- --port 5174
```

#### 3. CORS Errors

**Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. **Verify backend CORS settings** in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Ensure this matches frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Verify frontend URL:**
   - Make sure frontend is running on http://localhost:5173
   - Check browser address bar

3. **Hard refresh browser:** Ctrl+Shift+R (Chrome) or Cmd+Shift+R (Mac)

#### 4. Module Not Found Errors

**Backend:**
```bash
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend:**
```bash
Error: Cannot find module '@mui/material'
```

**Solution:**
```bash
cd frontend
npm install
```

#### 5. Database Locked

**Error:**
```
sqlite3.OperationalError: database is locked
```

**Solutions:**
1. Close all database connections
2. Stop the backend server
3. Delete `treasury.db` (will recreate on next start)
```bash
cd backend
rm treasury.db
python main.py  # Recreates database
```

#### 6. Permission Denied

**Error:**
```
Permission denied: './run.sh'
```

**Solution:**
```bash
chmod +x backend/run.sh
chmod +x frontend/run.sh
```

#### 7. Virtual Environment Issues

**Error:**
```
Command 'venv' not found
```

**Solution (Ubuntu/Debian):**
```bash
sudo apt install python3.10-venv
```

**Or use virtualenv:**
```bash
pip install virtualenv
virtualenv venv
```

#### 8. npm Install Fails

**Error:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules

# Or use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

#### 9. OCR Not Extracting Data

**Issue:** OCR returns null values

**Solutions:**
1. **Check image quality:**
   - Image must be clear and well-lit
   - Text must be readable
   - Supported formats: JPG, PNG

2. **Test Tesseract directly:**
```bash
tesseract receipt.jpg output
cat output.txt
```

3. **Adjust OCR patterns** in `backend/ocr_utils.py`:
```python
# Modify regex patterns to match your receipt format
patterns = [
    r'Total[:\s]+\$?(\d+\.?\d{0,2})',  # Add your patterns
]
```

#### 10. Login Fails

**Issue:** "Invalid credentials" even with correct password

**Solutions:**

1. **Check if admin was created:**
```bash
# Check database
sqlite3 backend/treasury.db
SELECT * FROM admins;
.quit
```

2. **Recreate admin:**
```python
# In Python shell
cd backend
source venv/bin/activate
python

>>> from database import get_db, init_db
>>> from models import Admin
>>> from passlib.context import CryptContext
>>> 
>>> pwd_context = CryptContext(schemes=["bcrypt"])
>>> db = next(get_db())
>>> 
>>> # Delete old admin
>>> db.query(Admin).filter(Admin.username == "admin").delete()
>>> 
>>> # Create new admin
>>> admin = Admin(
...     username="admin",
...     hashed_password=pwd_context.hash("admin123")
... )
>>> db.add(admin)
>>> db.commit()
>>> print("Admin created!")
```

---

## 🚀 Production Deployment

### Backend Deployment

#### 1. Environment Variables
Create `.env` with production values:
```bash
JWT_SECRET_KEY=<long-random-production-key>
DATABASE_URL=postgresql://user:pass@host:5432/treasury
CORS_ORIGINS=https://yourdomain.com
```

#### 2. Use Production Server
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### 3. Use PostgreSQL
Update `backend/database.py`:
```python
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./treasury.db")
```

### Frontend Deployment

#### 1. Build Production Bundle
```bash
cd frontend
npm run build
```

Output in `dist/` folder.

#### 2. Deploy Options

**Vercel:**
```bash
npm install -g vercel
vercel deploy
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
    }
}
```

---

## 📞 Additional Support

### Documentation
- **Main README:** `README.md`
- **Backend Guide:** `backend/BACKEND_SUMMARY.md`
- **Frontend Guide:** `frontend/FRONTEND_SUMMARY.md`
- **API Testing:** `backend/API_TESTING.md`
- **Architecture:** `ARCHITECTURE.md`

### Quick Commands Reference

```bash
# Start everything (from project root)
cd backend && ./run.sh &
cd frontend && ./run.sh

# Stop servers
# Press Ctrl+C in each terminal

# Reset database
cd backend
rm treasury.db
python main.py

# Update dependencies
cd backend && pip install -r requirements.txt --upgrade
cd frontend && npm update

# Run tests (if added)
cd backend && pytest
cd frontend && npm test
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Python 3.10+ installed (`python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Tesseract installed (`tesseract --version`)
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server starts on port 8000
- [ ] Frontend server starts on port 5173
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:8000/docs
- [ ] Can upload a receipt
- [ ] Can login to admin (admin/admin123)
- [ ] Can view receipts in dashboard
- [ ] Can edit OCR fields
- [ ] No console errors in browser

---

**Setup complete! Your Church Treasury System is ready to use! 🎉**
