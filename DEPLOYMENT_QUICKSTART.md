# 🚀 NECF Treasury System - Quick Deployment Reference

**For Mitchell - Quick Command Reference**  
**Last Updated**: November 20, 2025 - **NEW UPDATES!** ⚡

---

## 🆕 Latest Updates (Nov 20, 2025)

**IMPORTANT**: New fixes deployed - see [DEPLOYMENT_UPDATE_NOV20.md](./DEPLOYMENT_UPDATE_NOV20.md)

### What's New:
- ✅ Fixed API connection issue (localhost → production URL)
- ✅ Fixed page scrolling/bouncing issues
- ✅ 50% faster loading with code splitting
- ✅ Lazy loading for better performance

### Quick Update Command:
```bash
cd /path/to/NECF-OFFICIAL-TREASURY && \
git pull origin main && \
cd frontend && \
echo 'VITE_API_URL=https://necftreausry.com/api' > .env && \
npm install && \
npm run build && \
sudo systemctl restart nginx
```

---

## ⚡ Quick Start Commands

### Local Development

```bash
# 1. Clone Repository
git clone https://github.com/Tkapesa/NECF-OFFICIAL-TREASURY.git
cd NECF-OFFICIAL-TREASURY

# 2. Backend Setup
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python migrate_superuser.py
uvicorn main:app --reload --port 8000

# 3. Frontend Setup (new terminal)
cd frontend
npm install
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 🖥️ Production Deployment

### VPS Setup (Ubuntu)

```bash
# 1. Connect to Server
ssh root@your_server_ip

# 2. Install Prerequisites
apt update && apt upgrade -y
apt install python3.10 python3.10-venv python3-pip nodejs npm tesseract-ocr nginx certbot python3-certbot-nginx git -y

# 3. Create User
adduser necf
usermod -aG sudo necf
su - necf

# 4. Clone & Setup
git clone https://github.com/Tkapesa/NECF-OFFICIAL-TREASURY.git
cd NECF-OFFICIAL-TREASURY

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python migrate_superuser.py

# Frontend
cd ../frontend
npm install
npm run build

# 5. Configure Systemd Service
sudo nano /etc/systemd/system/necf-backend.service
```

**Systemd Service Content:**
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

**Start Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable necf-backend
sudo systemctl start necf-backend
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/necf
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        root /home/necf/NECF-OFFICIAL-TREASURY/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads/ {
        alias /home/necf/NECF-OFFICIAL-TREASURY/backend/uploads/;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/necf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Setup SSL:**
```bash
sudo certbot --nginx -d your_domain.com
```

---

## 🔐 Security Setup

```bash
# 1. Generate JWT Secret
openssl rand -hex 32

# 2. Create backend .env file
cd backend
nano .env
```

**Backend .env Content:**
```bash
JWT_SECRET_KEY=<paste_generated_key_here>
DEFAULT_ADMIN_USERNAME=your_secure_username
DEFAULT_ADMIN_PASSWORD=YourStrongPassword123!
CORS_ORIGINS=https://your_domain.com
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./treasury.db
MAX_UPLOAD_SIZE=10485760
```

**⚠️ NEW: Frontend .env file (REQUIRED!)**
```bash
# 3. Create frontend .env file
cd ../frontend
nano .env
```

**Frontend .env Content:**
```bash
# IMPORTANT: Replace with your actual domain!
VITE_API_URL=https://your_domain.com/api
```

**Example for necftreausry.com:**
```bash
VITE_API_URL=https://necftreausry.com/api
```

**Set Permissions:**
```bash
chmod 600 .env
chmod 600 treasury.db
chmod 700 uploads/
```

**Configure Firewall:**
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## 🗄️ Database Commands

```bash
cd backend

# View Database
sqlite3 treasury.db
.tables
SELECT * FROM admins;
SELECT * FROM receipts;
.quit

# Backup Database
cp treasury.db treasury_backup_$(date +%Y%m%d).db

# Reset Database
rm treasury.db
python main.py
python migrate_superuser.py
```

---

## 🔄 Update Commands

```bash
# Update Code
cd ~/NECF-OFFICIAL-TREASURY
git pull origin main

# Update Backend
cd backend
source venv/bin/activate
pip install --upgrade -r requirements.txt
sudo systemctl restart necf-backend

# Update Frontend
cd frontend
npm install
npm run build
sudo systemctl restart nginx
```

---

## 📊 Monitoring Commands

```bash
# View Logs
sudo journalctl -u necf-backend -f

# Check Status
sudo systemctl status necf-backend

# Check Disk Space
df -h
du -sh backend/uploads/

# Check Resources
htop  # or top
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Module Not Found
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### CORS Errors
```bash
# Check backend/main.py CORS settings
# Ensure frontend URL matches allow_origins
```

### Camera Not Working
```bash
# Check browser permissions
# Ensure HTTPS is enabled (required for camera API)
# Test in Chrome/Firefox latest version
```

### Database Locked
```bash
cd backend
# Stop server first
rm treasury.db
python main.py
python migrate_superuser.py
```

---

## 📱 Feature Testing Checklist

- [ ] Homepage loads
- [ ] Upload page accessible
- [ ] File upload works
- [ ] Camera capture works (mobile)
- [ ] OCR extracts data
- [ ] Admin login successful
- [ ] Dashboard displays receipts
- [ ] Dark mode toggle works
- [ ] Search and filter work
- [ ] Inline editing works
- [ ] CSV export downloads
- [ ] PDF export generates
- [ ] Superuser can manage admins
- [ ] Mobile responsive

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Backend Port** | 8000 |
| **Frontend Port** | 5173 (dev), 80/443 (prod) |
| **Database** | SQLite (treasury.db) |
| **Uploads** | backend/uploads/ |
| **Default Admin** | admin / admin123 |
| **API Docs** | http://localhost:8000/docs |

---

## 🎯 Common Tasks

### Create New Admin
```bash
# Login as superuser
# Navigate to Admin Management
# Click "Create New Admin"
# Fill username and password
# Toggle superuser if needed
```

### Export Receipts
```bash
# Login to dashboard
# Use search/filter if needed
# Click CSV or PDF button
# File downloads automatically
```

### Change Password
```bash
cd backend
python3 << EOF
from database import get_db
from models import Admin
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
db = next(get_db())

admin = db.query(Admin).filter(Admin.username == "admin").first()
admin.hashed_password = pwd_context.hash("NewPassword123!")
db.commit()
print("✅ Password updated")
EOF
```

### Backup Before Updates
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf backup_$DATE.tar.gz backend/treasury.db backend/uploads/
echo "✅ Backup created: backup_$DATE.tar.gz"
```

---

## 📚 Full Documentation

For detailed explanations, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup
- `ARCHITECTURE.md` - System design
- `backend/API_TESTING.md` - API reference

---

**Need help?** Check the full DEPLOYMENT_GUIDE.md or create an issue on GitHub.

**Last Updated:** November 18, 2025
