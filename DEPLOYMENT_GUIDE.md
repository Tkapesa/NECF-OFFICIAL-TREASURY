# 🚀 Complete Deployment Guide for NECF Treasury System

**For: Mitchell (Team Member)**  
**Project:** Near East Christian Fellowship Treasury Management System  
**Date:** November 2025  
**Version:** 2.0.0

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [System Requirements](#-system-requirements)
3. [Local Development Setup](#-local-development-setup)
4. [Database Setup](#-database-setup)
5. [Backend Deployment](#-backend-deployment)
6. [Frontend Deployment](#-frontend-deployment)
7. [Production Deployment](#-production-deployment)
8. [Environment Configuration](#-environment-configuration)
9. [Features Documentation](#-features-documentation)
10. [Troubleshooting](#-troubleshooting)
11. [Maintenance & Updates](#-maintenance--updates)

---

## 📖 Project Overview

### What is This Project?

The NECF Treasury System is a full-stack web application designed to manage church receipts with the following capabilities:

- **User Side**: Members can upload receipt images and fill in purchase details
- **Camera Feature**: NEW! Users can take photos directly from their mobile devices
- **OCR Technology**: Automatically extracts price, date, and time from receipts
- **Admin Dashboard**: Secure dashboard for admins to view, edit, and manage all receipts
- **Dark Mode**: Toggle between light and dark themes
- **Superuser System**: Role-based access control with superusers and regular admins

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | User interface |
| **UI Framework** | Material-UI (MUI) | Components & styling |
| **Backend** | FastAPI (Python) | REST API server |
| **Database** | SQLite | Data storage |
| **OCR Engine** | Tesseract OCR | Receipt text extraction |
| **Authentication** | JWT Tokens | Secure admin access |
| **File Storage** | Local filesystem | Receipt images |

### Key Features

✅ Receipt upload with image preview  
✅ **NEW: Camera capture** for taking photos directly  
✅ OCR extraction (price, date, time)  
✅ Admin authentication with JWT  
✅ Inline editing on dashboard  
✅ **Dark mode toggle** with localStorage persistence  
✅ **Superuser role** for admin management  
✅ Export to CSV and PDF  
✅ Mobile-responsive design  
✅ Real-time search and filtering  

---

## 💻 System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Ubuntu 18.04+
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: For initial package downloads

### Software Prerequisites

| Software | Version | Download Link |
|----------|---------|---------------|
| **Python** | 3.10 or higher | https://www.python.org/downloads/ |
| **Node.js** | 18.x or higher | https://nodejs.org/ |
| **npm** | Included with Node.js | - |
| **Tesseract OCR** | Latest | See installation section below |
| **Git** | Latest | https://git-scm.com/ |

### Installing Tesseract OCR

#### macOS
```bash
# Using Homebrew
brew install tesseract

# Verify installation
tesseract --version
```

#### Ubuntu/Debian Linux
```bash
# Update package list
sudo apt update

# Install Tesseract
sudo apt-get install tesseract-ocr

# Verify installation
tesseract --version
```

#### Windows
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer (e.g., `tesseract-ocr-w64-setup-5.3.0.exe`)
3. During installation, note the installation path (e.g., `C:\Program Files\Tesseract-OCR`)
4. Add to PATH or configure in code (see Backend Setup)

---

## 🛠️ Local Development Setup

### Step 1: Clone the Repository

```bash
# Navigate to your projects folder
cd ~/projects  # macOS/Linux
# OR
cd C:\Users\YourName\projects  # Windows

# Clone the repository
git clone https://github.com/Tkapesa/NECF-OFFICIAL-TREASURY.git

# Navigate into the project
cd NECF-OFFICIAL-TREASURY
```

### Step 2: Project Structure Overview

```
NECF-OFFICIAL-TREASURY/
│
├── backend/                      # Python FastAPI backend
│   ├── main.py                  # Main API server with all routes
│   ├── database.py              # Database connection & session
│   ├── models.py                # SQLAlchemy models (Receipt, Admin)
│   ├── ocr_utils.py             # Tesseract OCR logic
│   ├── migrate_superuser.py     # Database migration script
│   ├── requirements.txt         # Python dependencies
│   ├── run.sh                   # macOS/Linux startup script
│   ├── run.ps1                  # Windows PowerShell startup script
│   ├── treasury.db              # SQLite database (created on first run)
│   └── uploads/                 # Receipt image storage folder
│
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main app with routing
│   │   ├── api.js              # Axios API instance
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # Home page
│   │   │   ├── UploadPage.jsx         # Receipt upload page
│   │   │   └── AdminDashboard.jsx     # Admin dashboard (with dark mode)
│   │   └── components/
│   │       ├── ReceiptUploadForm.jsx  # Upload form (with camera)
│   │       ├── ReceiptTable.jsx       # Dashboard table (with dark mode)
│   │       └── AdminManagement.jsx    # Superuser admin management
│   ├── public/
│   │   └── necf-logo.png       # Church logo
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML entry point
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
├── SETUP_GUIDE.md              # Setup instructions
├── ARCHITECTURE.md             # System architecture
├── PROJECT_SUMMARY.md          # Feature list
└── DEPLOYMENT_GUIDE.md         # This file
```

---

## 🗄️ Database Setup

### Understanding the Database

The project uses **SQLite**, a file-based database that doesn't require a separate server. The database file `treasury.db` is created automatically on first run.

### Database Schema

#### 1. **Admins Table**
Stores admin user credentials and superuser status.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-increment) |
| `username` | VARCHAR | Unique username |
| `hashed_password` | VARCHAR | Bcrypt hashed password |
| `is_superuser` | BOOLEAN | Superuser flag (default: False) |
| `created_at` | DATETIME | Account creation timestamp |

**Default Admin:**
- Username: `admin`
- Password: `admin123`
- Superuser: `True`

#### 2. **Receipts Table**
Stores receipt submissions and OCR data.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key (auto-increment) |
| `user_name` | VARCHAR | Submitter's full name |
| `user_phone` | VARCHAR | Submitter's phone number |
| `item_bought` | TEXT | Description of purchase |
| `approved_by` | VARCHAR | Name of approver |
| `ocr_price` | FLOAT | Extracted price from receipt |
| `ocr_date` | VARCHAR | Extracted date (YYYY-MM-DD) |
| `ocr_time` | VARCHAR | Extracted time (HH:MM) |
| `ocr_raw_text` | TEXT | Full OCR text extraction |
| `image_path` | VARCHAR | Path to receipt image |
| `created_at` | DATETIME | Submission timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### Database Operations

#### View Database Contents
```bash
# Navigate to backend folder
cd backend

# Open SQLite CLI
sqlite3 treasury.db

# List all tables
.tables

# View all admins
SELECT * FROM admins;

# View all receipts
SELECT id, user_name, ocr_price, created_at FROM receipts;

# Exit SQLite
.quit
```

#### Reset Database
```bash
cd backend

# Stop the backend server first (Ctrl+C)

# Delete the database
rm treasury.db  # macOS/Linux
# OR
del treasury.db  # Windows

# Restart the server - it will recreate the database
python main.py
```

#### Backup Database
```bash
# Create backup with timestamp
cp backend/treasury.db backend/treasury_backup_$(date +%Y%m%d_%H%M%S).db

# On Windows
copy backend\treasury.db backend\treasury_backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%.db
```

---

## 🔧 Backend Deployment

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

A virtual environment isolates project dependencies from your system Python.

```bash
# Create virtual environment
python3 -m venv venv  # macOS/Linux
# OR
python -m venv venv  # Windows

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Your terminal should now show (venv) at the beginning
```

### Step 3: Install Python Dependencies

```bash
# Upgrade pip first
pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

**What gets installed:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - Database ORM
- `python-multipart` - File upload support
- `pytesseract` - OCR wrapper
- `Pillow` - Image processing
- `fastapi-jwt-auth` - JWT authentication
- `passlib[bcrypt]` - Password hashing
- `python-dateutil` - Date parsing
- `pydantic` - Data validation

### Step 4: Configure Tesseract (Windows Only)

If you're on Windows, you need to tell Python where Tesseract is installed.

1. Open `ocr_utils.py` in a text editor
2. Find this line near the top:
   ```python
   # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```
3. Uncomment it (remove the `#`) and update the path if needed:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

### Step 5: Run Database Migration (for Superuser Feature)

This updates the database schema to support superuser functionality.

```bash
# Make sure you're in the backend folder with venv activated
python migrate_superuser.py
```

**Expected output:**
```
✅ Database migration completed successfully
✅ Admin 'admin' is now a superuser
```

### Step 6: Start the Backend Server

#### Option A: Using uvicorn (Recommended)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Flags explained:**
- `--reload`: Auto-restart on code changes (development only)
- `--host 0.0.0.0`: Accept connections from any IP
- `--port 8000`: Run on port 8000

#### Option B: Using the run script
```bash
# macOS/Linux
chmod +x run.sh
./run.sh

# Windows PowerShell
.\run.ps1
```

#### Option C: Direct Python execution
```bash
python main.py
```

### Step 7: Verify Backend is Running

**Success indicators:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using StatReload
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Test endpoints:**
1. **API Documentation**: Open http://localhost:8000/docs in your browser
2. **Health Check**: Visit http://localhost:8000
3. **Test Login**: 
   ```bash
   curl -X POST http://localhost:8000/api/login \
     -F "username=admin" \
     -F "password=admin123"
   ```

### Backend API Endpoints Reference

#### Public Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | Health check | - |
| POST | `/api/receipts/upload` | Upload receipt | `multipart/form-data` with `image`, `user_name`, `user_phone`, `item_bought`, `approved_by` |

#### Admin Endpoints (Require JWT Token)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/login` | Admin login | No |
| GET | `/api/receipts` | Get all receipts | Yes |
| GET | `/api/receipts/{id}` | Get specific receipt | Yes |
| PUT | `/api/receipts/{id}` | Update receipt | Yes |
| DELETE | `/api/receipts/{id}` | Delete receipt | Yes |

#### Superuser Endpoints (Require Superuser JWT Token)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admins` | List all admins | Yes (Superuser) |
| POST | `/api/admins` | Create new admin | Yes (Superuser) |
| PUT | `/api/admins/{id}` | Update admin | Yes (Superuser) |
| DELETE | `/api/admins/{id}` | Delete admin | Yes (Superuser) |

---

## 🎨 Frontend Deployment

### Step 1: Navigate to Frontend Folder

```bash
# From project root
cd frontend
```

### Step 2: Install Node.js Dependencies

```bash
# Install all packages from package.json
npm install

# This will create node_modules/ folder with all dependencies
```

**What gets installed:**
- `react` & `react-dom` - Core React library
- `@mui/material` - Material-UI components
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling
- `@mui/icons-material` - Material Design icons
- `axios` - HTTP client for API calls
- `react-router-dom` - Client-side routing
- `vite` - Build tool and dev server

**Common npm issues:**

If you encounter errors, try:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
# OR
rmdir /s /q node_modules & del package-lock.json  # Windows

npm install
```

### Step 3: Configure API Base URL (Optional)

The frontend is preconfigured to connect to `http://localhost:8000`. If you need to change this:

1. Open `src/api.js`
2. Update the `baseURL`:
   ```javascript
   const api = axios.create({
     baseURL: 'http://localhost:8000',  // Change this if needed
   });
   ```

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 568 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Verify Frontend is Running

1. **Open browser**: Navigate to http://localhost:5173
2. **You should see**: The NECF landing page with:
   - Church logo
   - Welcome message
   - "Upload Receipt" button
   - "Admin Login" button

### Frontend Routes Overview

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Home page with navigation |
| `/upload` | UploadPage | Receipt upload form |
| `/admin` | AdminDashboard | Admin dashboard with login |

### Testing Frontend Features

#### Test 1: Landing Page
- ✅ Logo displays correctly
- ✅ Buttons are clickable
- ✅ Smooth animations

#### Test 2: Upload Page
1. Click "Upload Receipt"
2. Should see:
   - ✅ Upload form
   - ✅ Camera button (NEW!)
   - ✅ File upload button
   - ✅ Input fields

#### Test 3: Camera Feature (NEW!)
1. Click "Take Photo" button
2. Should see:
   - ✅ Camera permission prompt
   - ✅ Live camera preview
   - ✅ Frame guidelines
   - ✅ Capture and Switch Camera buttons

#### Test 4: Admin Login
1. Click "Admin Login"
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Should see:
   - ✅ Dashboard with receipt table
   - ✅ Statistics cards
   - ✅ Dark mode toggle (NEW!)

#### Test 5: Dark Mode (NEW!)
1. Login to admin dashboard
2. Click the dark mode toggle in sidebar
3. Should see:
   - ✅ Smooth transition to dark theme
   - ✅ All components styled correctly
   - ✅ Preference saved (persists on refresh)

---

## 🌐 Production Deployment

### Overview of Deployment Options

| Option | Best For | Difficulty | Cost |
|--------|----------|------------|------|
| **VPS** (DigitalOcean, Linode) | Full control, traditional hosting | Medium | $5-20/mo |
| **Docker** | Containerized deployment | Medium | Varies |
| **Heroku** | Quick deployment, no config | Easy | Free tier available |
| **AWS/GCP** | Enterprise, scalable | Hard | Pay-as-you-go |
| **Vercel/Netlify** | Frontend only | Easy | Free tier available |

### Option 1: VPS Deployment (DigitalOcean/Linode)

This is the most common and recommended approach for production.

#### A. Server Setup

1. **Create a VPS**:
   - Provider: DigitalOcean, Linode, Vultr, AWS EC2, etc.
   - OS: Ubuntu 22.04 LTS (recommended)
   - RAM: 2GB minimum (4GB recommended)
   - Storage: 25GB+

2. **Connect to server**:
   ```bash
   ssh root@your_server_ip
   ```

3. **Update system**:
   ```bash
   apt update && apt upgrade -y
   ```

4. **Install required software**:
   ```bash
   # Python 3.10+
   apt install python3.10 python3.10-venv python3-pip -y

   # Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install nodejs -y

   # Tesseract OCR
   apt install tesseract-ocr -y

   # Nginx (web server)
   apt install nginx -y

   # Certbot (SSL certificates)
   apt install certbot python3-certbot-nginx -y

   # Git
   apt install git -y
   ```

#### B. Deploy Backend

1. **Create application user**:
   ```bash
   adduser necf
   usermod -aG sudo necf
   su - necf
   ```

2. **Clone repository**:
   ```bash
   cd ~
   git clone https://github.com/Tkapesa/NECF-OFFICIAL-TREASURY.git
   cd NECF-OFFICIAL-TREASURY
   ```

3. **Setup backend**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Create systemd service**:
   ```bash
   sudo nano /etc/systemd/system/necf-backend.service
   ```

   **Add this content**:
   ```ini
   [Unit]
   Description=NECF Treasury Backend
   After=network.target

   [Service]
   Type=simple
   User=necf
   WorkingDirectory=/home/necf/NECF-OFFICIAL-TREASURY/backend
   Environment="PATH=/home/necf/NECF-OFFICIAL-TREASURY/backend/venv/bin"
   ExecStart=/home/necf/NECF-OFFICIAL-TREASURY/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

5. **Start backend service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable necf-backend
   sudo systemctl start necf-backend
   sudo systemctl status necf-backend
   ```

#### C. Deploy Frontend

1. **Build frontend**:
   ```bash
   cd ~/NECF-OFFICIAL-TREASURY/frontend
   npm install
   npm run build
   ```

2. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/necf
   ```

   **Add this content** (replace `your_domain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name your_domain.com www.your_domain.com;

       # Frontend
       location / {
           root /home/necf/NECF-OFFICIAL-TREASURY/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api/ {
           proxy_pass http://localhost:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Backend docs
       location /docs {
           proxy_pass http://localhost:8000;
       }

       # Receipt images
       location /uploads/ {
           alias /home/necf/NECF-OFFICIAL-TREASURY/backend/uploads/;
       }
   }
   ```

3. **Enable site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/necf /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL (HTTPS)**:
   ```bash
   sudo certbot --nginx -d your_domain.com -d www.your_domain.com
   ```

#### D. Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

#### E. Setup Production Environment Variables

```bash
cd ~/NECF-OFFICIAL-TREASURY/backend
nano .env
```

**Add production settings**:
```bash
# SECURITY - CHANGE THESE!
JWT_SECRET_KEY=your_super_secret_key_here_min_32_characters_long
DEFAULT_ADMIN_PASSWORD=YourStrongPasswordHere123!

# Database
DATABASE_URL=sqlite:///./treasury.db

# CORS (use your actual domain)
CORS_ORIGINS=https://your_domain.com,https://www.your_domain.com

# File uploads
MAX_UPLOAD_SIZE=10485760

# Token expiration (24 hours)
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

**Generate secure JWT secret**:
```bash
openssl rand -hex 32
```

### Option 2: Docker Deployment

#### A. Create Dockerfile for Backend

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.10-slim

# Install Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### B. Create Dockerfile for Frontend

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### C. Create docker-compose.yml

Create `docker-compose.yml` in project root:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/treasury.db:/app/treasury.db
    environment:
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DATABASE_URL=sqlite:///./treasury.db
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### D. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

### Option 3: Heroku Deployment

#### A. Prepare Backend for Heroku

Create `backend/Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Create `backend/runtime.txt`:
```
python-3.10.12
```

Install Heroku CLI and deploy:
```bash
# Login to Heroku
heroku login

# Create app
heroku create necf-treasury-backend

# Add buildpack for Tesseract
heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt
heroku buildpacks:add --index 2 heroku/python

# Create Aptfile for Tesseract
echo "tesseract-ocr" > backend/Aptfile

# Deploy
cd backend
git init
git add .
git commit -m "Initial backend commit"
heroku git:remote -a necf-treasury-backend
git push heroku master

# Set environment variables
heroku config:set JWT_SECRET_KEY=$(openssl rand -hex 32)
heroku config:set DATABASE_URL=sqlite:///./treasury.db
```

#### B. Deploy Frontend to Vercel/Netlify

**For Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts and configure
```

**For Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

---

## ⚙️ Environment Configuration

### Development Environment (.env.example)

Create `.env` file in backend folder:

```bash
# ===========================================
# NECF Treasury System - Environment Variables
# ===========================================

# ============ SECURITY ============
# JWT Secret Key - CHANGE THIS IN PRODUCTION!
# Generate with: openssl rand -hex 32
JWT_SECRET_KEY=your_super_secret_key_change_this_in_production_min_32_chars

# JWT Token Expiration (in minutes)
# 1440 = 24 hours, 43200 = 30 days
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ============ DATABASE ============
# SQLite database file path
DATABASE_URL=sqlite:///./treasury.db

# For PostgreSQL (production):
# DATABASE_URL=postgresql://user:password@localhost:5432/treasury

# ============ CORS ============
# Allowed origins (comma-separated)
# Development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Production (use your actual domain)
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ============ ADMIN CREDENTIALS ============
# Default admin account (created on first run)
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123

# ⚠️ IMPORTANT: Change these in production!

# ============ FILE UPLOADS ============
# Maximum file upload size (in bytes)
# 10485760 = 10MB
MAX_UPLOAD_SIZE=10485760

# Upload directory path
UPLOAD_DIR=./uploads

# ============ OCR SETTINGS ============
# Tesseract executable path (Windows only)
# TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe

# OCR language (default: eng for English)
OCR_LANG=eng

# ============ SERVER SETTINGS ============
# Server host and port
HOST=0.0.0.0
PORT=8000

# Debug mode (True for development, False for production)
DEBUG=True

# ============ LOGGING ============
# Log level: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO

# Log file path
LOG_FILE=./server.log
```

### Production Security Checklist

Before going live, ensure you've done the following:

#### 1. Change Default Credentials
```bash
# Generate strong password
openssl rand -base64 32

# Update .env
DEFAULT_ADMIN_USERNAME=your_secure_username
DEFAULT_ADMIN_PASSWORD=YourStrongPassword123!@#
```

#### 2. Generate Secure JWT Secret
```bash
# Generate 32-byte random hex string
openssl rand -hex 32

# Copy output to .env
JWT_SECRET_KEY=<paste_generated_key_here>
```

#### 3. Update CORS Origins
```bash
# Use your actual domain
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### 4. Set File Permissions
```bash
# Restrict .env file access
chmod 600 .env

# Restrict database file
chmod 600 treasury.db

# Restrict uploads folder
chmod 700 uploads/
```

#### 5. Enable HTTPS
- Use Let's Encrypt (free SSL)
- Configure Nginx/Apache for HTTPS
- Redirect all HTTP to HTTPS

#### 6. Setup Firewall
```bash
# Ubuntu/Debian
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
```

#### 7. Regular Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz treasury.db uploads/
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

---

## 📱 Features Documentation

### Feature 1: Receipt Upload

#### User Flow:
1. User navigates to `/upload`
2. Fills in personal information
3. Chooses one of two options:
   - **Upload from Gallery**: Selects image from device
   - **Take Photo**: Opens camera to capture receipt

#### File Requirements:
- **Formats**: JPG, JPEG, PNG
- **Max Size**: 10MB
- **Quality**: Clear, readable text

#### Backend Processing:
1. Receives multipart form data
2. Validates image file
3. Saves to `uploads/` folder with timestamp
4. Runs OCR extraction
5. Saves all data to database
6. Returns receipt ID and OCR results

### Feature 2: Camera Capture (NEW!)

#### How It Works:
1. User clicks "Take Photo" button
2. Browser requests camera permission
3. Live camera preview appears with guidelines
4. User positions receipt within frame
5. Clicks "Capture" to take photo
6. Image is converted to JPEG and uploaded

#### Technical Details:
- Uses `navigator.mediaDevices.getUserMedia()` API
- Supports front and back camera switching
- Canvas-based image capture
- Automatic JPEG conversion (0.9 quality)
- Mobile-optimized with responsive layout

#### Supported Browsers:
- ✅ Chrome/Edge 53+
- ✅ Firefox 36+
- ✅ Safari 11+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Feature 3: OCR Extraction

#### What Gets Extracted:
- **Price**: Currency amounts (₺, $, €, £, etc.)
- **Date**: Various formats (DD/MM/YYYY, MM-DD-YYYY, etc.)
- **Time**: 12-hour and 24-hour formats

#### OCR Process:
1. **Image preprocessing**: Convert to grayscale, enhance contrast
2. **Text extraction**: Tesseract OCR reads all text
3. **Pattern matching**: Regex patterns extract structured data
4. **Validation**: Check extracted data for validity
5. **Storage**: Save to database

#### Improving OCR Accuracy:
- **Good lighting**: Ensure receipt is well-lit
- **No blur**: Keep camera steady
- **Flat surface**: Avoid wrinkles or folds
- **High contrast**: Dark text on light background
- **Proper angle**: Straight-on, not tilted

#### Customizing OCR Patterns:

Edit `backend/ocr_utils.py`:
```python
# Price patterns (add your currency)
price_pattern = r'[\$€£₺]\s*(\d+[\.,]\d{2})|(\d+[\.,]\d{2})\s*[\$€£₺]'

# Date patterns (add your format)
date_pattern = r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}'

# Time patterns
time_pattern = r'\d{1,2}:\d{2}(?:\s*[APap][Mm])?'
```

### Feature 4: Admin Dashboard with Dark Mode

#### Dashboard Features:
- **Statistics cards**: Total receipts, total amount, approved, pending
- **Search functionality**: Filter by name, phone, item
- **Status filter**: All, Approved, Pending
- **Inline editing**: Click to edit OCR fields
- **Export options**: CSV and PDF
- **Dark mode toggle**: Light/dark theme switching

#### Dark Mode Implementation:
- Toggle button in sidebar (sun/moon icons)
- Persists preference in localStorage
- Smooth color transitions
- All components styled for both themes
- Accessible color contrast ratios

#### Using Dark Mode:
1. Login to admin dashboard
2. Locate dark mode toggle in sidebar (bottom section)
3. Click to switch between light and dark
4. Preference is saved automatically
5. Persists across browser sessions

### Feature 5: Superuser Role System

#### User Roles:
- **Superuser**: Full access, can manage other admins
- **Regular Admin**: Can view and edit receipts only

#### Superuser Privileges:
- ✅ View all admins
- ✅ Create new admin accounts
- ✅ Edit admin usernames
- ✅ Delete admin accounts
- ✅ Grant/revoke superuser status
- ✅ All regular admin features

#### Creating Additional Admins:
1. Login with superuser account (`admin` / `admin123`)
2. Click "Admin Management" in sidebar
3. Click "Create New Admin" button
4. Fill in username and password
5. Toggle "Superuser" if needed
6. Click "Create Admin"

#### Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Cannot be all spaces

### Feature 6: Export Functionality

#### CSV Export:
- Includes all receipt data
- Summary section with totals
- Timestamp in filename
- Opens in Excel/Google Sheets

#### PDF Export:
- Professional report format
- Church logo at top
- Summary statistics
- Detailed receipt table
- Footer with timestamp
- Print-optimized layout

#### Using Export Features:
1. Login to dashboard
2. Filter receipts if needed (search/status)
3. Click "CSV" or "PDF" button in top bar
4. File downloads automatically
5. Check Downloads folder

---

## 🐛 Troubleshooting

### Common Backend Issues

#### Issue 1: "Module Not Found" Error
**Symptom:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment first!
pip install -r requirements.txt
```

#### Issue 2: "Tesseract Not Found" Error
**Symptom:** `pytesseract.pytesseract.TesseractNotFoundError`

**Solutions:**

**macOS:**
```bash
brew install tesseract
tesseract --version  # Verify installation
```

**Ubuntu/Linux:**
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
tesseract --version
```

**Windows:**
1. Download installer: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to `C:\Program Files\Tesseract-OCR\`
3. Edit `backend/ocr_utils.py`:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

#### Issue 3: "Port Already in Use"
**Symptom:** `ERROR: [Errno 48] Address already in use`

**Solution:**
```bash
# Find and kill process on port 8000
# macOS/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

#### Issue 4: "Database Locked"
**Symptom:** `sqlite3.OperationalError: database is locked`

**Solution:**
```bash
# Stop backend server (Ctrl+C)
cd backend
rm treasury.db
# Restart server - will recreate database
python main.py
```

#### Issue 5: OCR Returns Null/Empty Values
**Symptom:** All OCR fields are empty or null

**Troubleshooting Steps:**
1. **Test Tesseract directly:**
   ```bash
   tesseract path/to/receipt.jpg output
   cat output.txt  # Check extracted text
   ```

2. **Check image quality:**
   - Is text clear and readable?
   - Good lighting?
   - Not blurry or distorted?

3. **Try different receipt:**
   - Some receipts have unusual fonts
   - Thermal receipts fade over time

4. **Check OCR patterns:**
   - Edit `backend/ocr_utils.py`
   - Add more regex patterns for your region

#### Issue 6: JWT Token Errors
**Symptom:** `401 Unauthorized` or `Token has expired`

**Solutions:**
```bash
# Check if JWT_SECRET_KEY is set
cat backend/.env | grep JWT_SECRET_KEY

# If missing, generate new one
openssl rand -hex 32 >> backend/.env

# Edit .env and add:
JWT_SECRET_KEY=<paste_generated_key>
```

### Common Frontend Issues

#### Issue 1: "Cannot Find Module" Error
**Symptom:** `Error: Cannot find module '@mui/material'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Issue 2: Blank White Screen
**Symptom:** Browser shows blank page, no errors

**Troubleshooting:**
1. **Check browser console**: Press F12, look for errors
2. **Check backend is running**: Visit http://localhost:8000/docs
3. **Check API connection**:
   ```bash
   curl http://localhost:8000
   ```
4. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

#### Issue 3: CORS Errors
**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check both servers are running on correct ports
2. Verify `backend/main.py` CORS settings:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],  # Match frontend port
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Restart backend server after changes

#### Issue 4: Camera Not Working
**Symptom:** "Unable to access camera" error

**Solutions:**
1. **Check browser permissions**:
   - Chrome: Settings → Privacy → Site Settings → Camera
   - Allow for localhost

2. **HTTPS required**: Camera API requires HTTPS (except localhost)

3. **Check browser support**: Use Chrome 53+, Firefox 36+, Safari 11+

4. **Check device**: Does your device have a camera?

5. **Test manually**:
   ```javascript
   // Open browser console (F12)
   navigator.mediaDevices.getUserMedia({ video: true })
     .then(stream => console.log("Camera works!"))
     .catch(err => console.error("Camera error:", err));
   ```

#### Issue 5: Dark Mode Not Persisting
**Symptom:** Dark mode resets to light on refresh

**Solution:**
1. **Check localStorage**: Open console, type:
   ```javascript
   localStorage.getItem('darkMode')
   ```
2. **Clear browser data**: May be disabled by browser settings
3. **Check browser support**: Ensure localStorage is enabled

#### Issue 6: Images Not Displaying
**Symptom:** Receipt images show broken image icon

**Solution:**
1. **Check uploads folder exists**:
   ```bash
   ls -la backend/uploads/
   ```
2. **Check file permissions**:
   ```bash
   chmod 755 backend/uploads/
   ```
3. **Check image paths in database**:
   ```bash
   sqlite3 backend/treasury.db
   SELECT id, image_path FROM receipts LIMIT 5;
   ```
4. **Verify Nginx configuration** (if deployed):
   ```nginx
   location /uploads/ {
       alias /path/to/backend/uploads/;
   }
   ```

### Database Issues

#### Issue 1: Cannot Create Admin
**Symptom:** Error when trying to create admin account

**Solution:**
```bash
cd backend
python migrate_superuser.py
# Should see: ✅ Database migration completed successfully
```

#### Issue 2: Database Schema Errors
**Symptom:** Column doesn't exist errors

**Solution (Reset Database):**
```bash
cd backend
# Backup first
cp treasury.db treasury_backup.db

# Delete and recreate
rm treasury.db
python main.py  # Creates fresh database

# Run migration
python migrate_superuser.py
```

#### Issue 3: View Database Contents
**Need to inspect database?**

```bash
cd backend

# Option 1: SQLite CLI
sqlite3 treasury.db
.schema  # Show table structures
SELECT * FROM admins;
SELECT COUNT(*) FROM receipts;
.quit

# Option 2: DB Browser for SQLite (GUI)
# Download from: https://sqlitebrowser.org/
```

### Performance Issues

#### Issue 1: Slow OCR Processing
**Symptom:** Upload takes a long time

**Solutions:**
1. **Reduce image size**: Add image compression
2. **Optimize Tesseract**: Use faster OCR config
3. **Use background tasks**: Process OCR asynchronously

**Quick fix - Add to `ocr_utils.py`:**
```python
from PIL import Image

def optimize_image(image_path):
    img = Image.open(image_path)
    # Resize if too large
    max_size = (1920, 1920)
    img.thumbnail(max_size, Image.LANCZOS)
    img.save(image_path, optimize=True, quality=85)
```

#### Issue 2: Large Upload Folder
**Symptom:** uploads/ folder getting too large

**Solution (Compress old images):**
```bash
cd backend/uploads

# Find images older than 30 days and compress
find . -name "*.jpg" -mtime +30 -exec mogrify -quality 70 {} \;
```

### Deployment Issues

#### Issue 1: Nginx 502 Bad Gateway
**Symptom:** Nginx shows 502 error

**Solutions:**
1. **Check backend is running**:
   ```bash
   sudo systemctl status necf-backend
   ```
2. **Check backend logs**:
   ```bash
   sudo journalctl -u necf-backend -f
   ```
3. **Check Nginx error logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

#### Issue 2: SSL Certificate Errors
**Symptom:** HTTPS not working, certificate errors

**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check expiration
sudo certbot certificates
```

#### Issue 3: Permission Denied Errors
**Symptom:** Cannot write to uploads folder

**Solution:**
```bash
# Fix permissions
sudo chown -R necf:necf /home/necf/NECF-OFFICIAL-TREASURY
sudo chmod 755 /home/necf/NECF-OFFICIAL-TREASURY/backend/uploads
```

---

## 🔄 Maintenance & Updates

### Regular Maintenance Tasks

#### Daily Tasks:
- ✅ Check server status
- ✅ Monitor disk space
- ✅ Review error logs

#### Weekly Tasks:
- ✅ Backup database
- ✅ Review uploaded receipts
- ✅ Check for failed uploads

#### Monthly Tasks:
- ✅ Update dependencies
- ✅ Rotate logs
- ✅ Optimize database
- ✅ Review user feedback

### Backup Strategy

#### Automated Daily Backups

Create `backup.sh`:
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/home/necf/backups"
PROJECT_DIR="/home/necf/NECF-OFFICIAL-TREASURY/backend"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database and uploads
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz \
    -C $PROJECT_DIR \
    treasury.db \
    uploads/

# Remove backups older than retention period
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Log
echo "[$DATE] Backup completed" >> $BACKUP_DIR/backup.log
```

**Setup cron job:**
```bash
chmod +x backup.sh

# Edit crontab
crontab -e

# Add line (runs daily at 2 AM):
0 2 * * * /home/necf/backup.sh
```

#### Manual Backup
```bash
cd backend

# Create timestamped backup
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz treasury.db uploads/

# Verify backup
tar -tzf backup_$DATE.tar.gz
```

#### Restore from Backup
```bash
# Stop server first
sudo systemctl stop necf-backend

# Extract backup
tar -xzf backup_20251118_140530.tar.gz

# Restart server
sudo systemctl start necf-backend
```

### Updating the Application

#### Update Backend Code
```bash
cd ~/NECF-OFFICIAL-TREASURY

# Backup first!
./backup.sh

# Pull latest changes
git pull origin main

# Update dependencies
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt

# Restart service
sudo systemctl restart necf-backend
```

#### Update Frontend Code
```bash
cd ~/NECF-OFFICIAL-TREASURY/frontend

# Pull latest changes
git pull origin main

# Update dependencies
npm install

# Rebuild
npm run build

# Restart Nginx
sudo systemctl restart nginx
```

#### Update Python Packages
```bash
cd backend
source venv/bin/activate

# Check outdated packages
pip list --outdated

# Update specific package
pip install --upgrade package_name

# Update all packages
pip install --upgrade -r requirements.txt

# Save new versions
pip freeze > requirements.txt
```

#### Update Node Packages
```bash
cd frontend

# Check outdated packages
npm outdated

# Update specific package
npm install package_name@latest

# Update all packages
npm update

# Save new versions
npm install
```

### Monitoring & Logs

#### View Backend Logs
```bash
# Live logs
sudo journalctl -u necf-backend -f

# Last 100 lines
sudo journalctl -u necf-backend -n 100

# Today's logs
sudo journalctl -u necf-backend --since today

# Specific date
sudo journalctl -u necf-backend --since "2025-11-18"
```

#### View Nginx Logs
```bash
# Access log (visitor requests)
sudo tail -f /var/log/nginx/access.log

# Error log
sudo tail -f /var/log/nginx/error.log
```

#### Monitor Disk Usage
```bash
# Check overall disk space
df -h

# Check uploads folder size
du -sh backend/uploads/

# Find large files
find backend/uploads/ -type f -size +5M -ls
```

#### Monitor Server Resources
```bash
# CPU and memory usage
htop

# Or simpler version
top

# Check specific process
ps aux | grep uvicorn
```

### Database Maintenance

#### Optimize Database
```bash
cd backend

# Vacuum database (reclaim space)
sqlite3 treasury.db "VACUUM;"

# Analyze database (update statistics)
sqlite3 treasury.db "ANALYZE;"
```

#### Database Statistics
```bash
sqlite3 treasury.db << EOF
SELECT 'Total Receipts:', COUNT(*) FROM receipts;
SELECT 'Total Admins:', COUNT(*) FROM admins;
SELECT 'Database Size:', page_count * page_size / 1024 || ' KB' 
FROM pragma_page_count(), pragma_page_size();
EOF
```

#### Clean Old Receipts (Optional)
```bash
# Delete receipts older than 1 year
sqlite3 treasury.db << EOF
BEGIN TRANSACTION;
DELETE FROM receipts 
WHERE created_at < datetime('now', '-1 year');
COMMIT;
EOF
```

### Security Audits

#### Change Admin Password
```bash
cd backend
python3 << EOF
from database import get_db
from models import Admin
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
db = next(get_db())

admin = db.query(Admin).filter(Admin.username == "admin").first()
admin.hashed_password = pwd_context.hash("NewSecurePassword123!")
db.commit()
print("✅ Password updated successfully")
EOF
```

#### Review Admin Accounts
```bash
sqlite3 backend/treasury.db << EOF
SELECT id, username, is_superuser, created_at 
FROM admins 
ORDER BY created_at DESC;
EOF
```

#### Check File Permissions
```bash
# Should be 600 (owner read/write only)
ls -l backend/.env
ls -l backend/treasury.db

# Fix if needed
chmod 600 backend/.env
chmod 600 backend/treasury.db
chmod 700 backend/uploads/
```

---

## 📚 Additional Resources

### Documentation Files in Project

| File | Description |
|------|-------------|
| `README.md` | Project overview and quick start |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `ARCHITECTURE.md` | System architecture diagrams |
| `PROJECT_SUMMARY.md` | Complete feature list |
| `backend/API_TESTING.md` | API endpoint testing guide |
| `backend/BACKEND_SUMMARY.md` | Backend code documentation |
| `frontend/FRONTEND_SUMMARY.md` | Frontend code documentation |
| `OCR_FEATURE.md` | OCR system documentation |
| `SUPERUSER_FEATURE.md` | Superuser role system guide |
| `HOW_TO_VIEW_OCR_TEXT.md` | OCR text viewing guide |

### External Resources

#### FastAPI
- Official Docs: https://fastapi.tiangolo.com/
- Tutorial: https://fastapi.tiangolo.com/tutorial/
- Deployment: https://fastapi.tiangolo.com/deployment/

#### React
- Official Docs: https://react.dev/
- React Router: https://reactrouter.com/
- Hooks Reference: https://react.dev/reference/react

#### Material-UI
- Components: https://mui.com/material-ui/
- Icons: https://mui.com/material-ui/material-icons/
- Styling: https://mui.com/system/styled/

#### Tesseract OCR
- GitHub: https://github.com/tesseract-ocr/tesseract
- Documentation: https://tesseract-ocr.github.io/
- Languages: https://tesseract-ocr.github.io/tessdoc/Data-Files

#### SQLite
- Official Docs: https://www.sqlite.org/docs.html
- CLI Guide: https://www.sqlite.org/cli.html
- DB Browser: https://sqlitebrowser.org/

### Video Tutorials (Recommended)

- **FastAPI Full Course**: https://www.youtube.com/watch?v=0sOvCWFmrtA
- **React Crash Course**: https://www.youtube.com/watch?v=w7ejDZ8SWv8
- **Material-UI Tutorial**: https://www.youtube.com/watch?v=Xoz31I1FuiY
- **Deployment with Nginx**: https://www.youtube.com/watch?v=hf8wUUrGCgU

### Community & Support

- **FastAPI Discord**: https://discord.com/invite/VQjSZaeJmf
- **React Community**: https://react.dev/community
- **Stack Overflow**: Tag questions with `fastapi`, `reactjs`, `material-ui`

---

## ✅ Deployment Checklist

Use this checklist to ensure you haven't missed any steps:

### Pre-Deployment
- [ ] All code tested locally
- [ ] Database backed up
- [ ] Environment variables configured
- [ ] Default passwords changed
- [ ] JWT secret key generated
- [ ] CORS origins updated
- [ ] File permissions set correctly

### Backend Deployment
- [ ] Server provisioned
- [ ] Python 3.10+ installed
- [ ] Tesseract OCR installed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Database migrated
- [ ] Systemd service configured
- [ ] Backend running and accessible
- [ ] API endpoints tested

### Frontend Deployment
- [ ] Node.js 18+ installed
- [ ] Dependencies installed
- [ ] Production build created
- [ ] Nginx configured
- [ ] Static files serving correctly
- [ ] API proxy working
- [ ] All routes accessible

### Security
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured
- [ ] Default credentials changed
- [ ] JWT secret key strong and unique
- [ ] File permissions restrictive
- [ ] CORS properly configured
- [ ] Error messages don't leak info

### Monitoring
- [ ] Backup system configured
- [ ] Log rotation set up
- [ ] Monitoring alerts configured
- [ ] Health check endpoints working
- [ ] Resource usage monitored

### Testing
- [ ] Can upload receipt
- [ ] Camera feature works on mobile
- [ ] OCR extraction working
- [ ] Admin login successful
- [ ] Dashboard loads correctly
- [ ] Dark mode toggle works
- [ ] Superuser features accessible
- [ ] Export (CSV/PDF) working
- [ ] Mobile responsive

---

## 🎓 Learning Path for Mitchell

If you're new to any of these technologies, here's a recommended learning order:

### Week 1: Basics
1. **Python basics** (if needed)
2. **JavaScript & React basics**
3. **Git & GitHub basics**
4. **Command line basics**

### Week 2: Backend
1. **FastAPI tutorial**
2. **SQLAlchemy ORM**
3. **JWT authentication**
4. **REST API concepts**

### Week 3: Frontend
1. **React hooks (useState, useEffect)**
2. **React Router**
3. **Axios for API calls**
4. **Material-UI components**

### Week 4: Deployment
1. **Linux server basics**
2. **Nginx configuration**
3. **SSL certificates**
4. **Systemd services**

### Week 5: Advanced
1. **Camera API**
2. **OCR optimization**
3. **Dark mode implementation**
4. **Performance optimization**

---

## 🤝 Getting Help

If you run into issues Mitchell, here's how to get help:

### 1. Check Documentation
- Start with this guide
- Check `README.md` for quick reference
- Review `TROUBLESHOOTING` section above

### 2. Search for Error Messages
- Copy exact error message
- Google with project context
- Check Stack Overflow

### 3. Debug Systematically
1. **Identify the problem**: What exactly isn't working?
2. **Check logs**: What do the error messages say?
3. **Isolate the issue**: Backend or frontend?
4. **Test components**: Does each part work independently?
5. **Check recent changes**: Did something break after an update?

### 4. Ask for Help
When asking for help, include:
- What you're trying to do
- What you expected to happen
- What actually happened
- Error messages (full text)
- Steps you've already tried
- Your environment (OS, versions)

### 5. Contact Me
If you need direct help:
- Create an issue in the GitHub repository
- Include screenshots if relevant
- Describe your environment and setup

---

## 📝 Final Notes

### Important Reminders

1. **Always backup before making changes**
2. **Test in development before deploying to production**
3. **Keep secrets secret** (never commit `.env` to Git)
4. **Update dependencies regularly** (but test first!)
5. **Monitor logs frequently** (catch issues early)
6. **Document any customizations** (for future reference)

### Success Metrics

You'll know the deployment is successful when:
- ✅ Users can upload receipts
- ✅ Camera feature works on mobile devices
- ✅ OCR extracts data correctly
- ✅ Admins can login and view dashboard
- ✅ Dark mode toggle works smoothly
- ✅ Exports generate correctly
- ✅ No error messages in logs
- ✅ Site loads quickly
- ✅ Mobile responsive

### Next Steps After Deployment

1. **Monitor for a week**: Watch logs, check for errors
2. **Gather user feedback**: Ask users about experience
3. **Optimize based on usage**: Adjust settings as needed
4. **Plan updates**: Schedule regular maintenance
5. **Document issues**: Keep track of problems and solutions

---

## 🎉 Congratulations!

You've reached the end of the deployment guide. If you've followed all the steps, you should now have a fully functional NECF Treasury System running!

### What You've Accomplished
- ✅ Set up a complete full-stack application
- ✅ Deployed backend API with OCR capabilities
- ✅ Deployed frontend with modern React
- ✅ Configured secure authentication
- ✅ Enabled camera capture feature
- ✅ Implemented dark mode
- ✅ Set up superuser role system
- ✅ Configured production environment
- ✅ Established backup and monitoring

### Keep Learning
Technology evolves rapidly. Stay updated with:
- Follow project updates on GitHub
- Read release notes for dependencies
- Join developer communities
- Practice and experiment
- Build on this foundation

### Good Luck Mitchell! 🚀

You've got this! The NECF Treasury System is now in your capable hands. Remember, every expert was once a beginner. Don't hesitate to ask questions and keep learning.

---

**Prepared by:** Claude (AI Assistant)  
**For:** Mitchell, NECF Team Member  
**Project:** Near East Christian Fellowship Treasury Management System  
**Date:** November 18, 2025  
**Version:** 2.0.0  

**Repository:** https://github.com/Tkapesa/NECF-OFFICIAL-TREASURY

---

*This guide is comprehensive, but technology changes. Always refer to official documentation for the latest information.*
