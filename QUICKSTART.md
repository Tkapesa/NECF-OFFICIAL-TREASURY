# 🚀 QUICK START GUIDE
## Church Treasury System

### Prerequisites Checklist
- [ ] Python 3.9+ installed (`python3 --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Tesseract OCR installed (`tesseract --version`)

If Tesseract is not installed:
```bash
# macOS
brew install tesseract

# Ubuntu/Debian
sudo apt-get install tesseract-ocr

# Windows
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
```

---

## 🎯 Step 1: Start Backend (Terminal 1)

```bash
cd backend
./run.sh
```

**What happens:**
- Creates Python virtual environment
- Installs all dependencies
- Creates SQLite database
- Creates default admin (username: `admin`, password: `admin123`)
- Starts server at http://localhost:8000

**Manual alternative:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## 🎨 Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
./run.sh
```

**What happens:**
- Installs npm dependencies
- Starts Vite dev server at http://localhost:5173

**Manual alternative:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Step 3: Access the Application

### User Side (Upload Receipts)
**URL:** http://localhost:5173

**Actions:**
1. Upload a receipt image
2. Fill in:
   - Your name
   - Phone number
   - What you bought
   - Who approved it
3. Click "Submit Receipt"
4. System automatically extracts price, date, and time

### Admin Side (Dashboard)
**URL:** http://localhost:5173/admin

**Login:**
- Username: `admin`
- Password: `admin123`

**Actions:**
1. View all submitted receipts
2. Click receipt images to view full size
3. Click OCR fields (price, date, time) to edit
4. Click save icon to update

---

## 📝 Testing the System

### Test 1: Upload a Receipt
1. Go to http://localhost:5173
2. Select any image (even a non-receipt for testing)
3. Fill in the form
4. Submit

### Test 2: Admin Login
1. Go to http://localhost:5173/admin
2. Login with `admin` / `admin123`
3. View the receipt you just uploaded

### Test 3: Edit OCR Data
1. In the admin dashboard
2. Click on the price field
3. Change the value
4. Click save icon
5. Refresh to see the update

---

## 🔧 Common Issues & Solutions

### ❌ "Tesseract not found"
```bash
brew install tesseract  # macOS
```

### ❌ "Port 8000 already in use"
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9
```

### ❌ "Port 5173 already in use"
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

### ❌ "Module not found"
Backend:
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
npm install
```

### ❌ "CORS Error"
- Ensure backend is running on port 8000
- Ensure frontend is running on port 5173
- Check browser console for specific error

### ❌ "Login not working"
- Check backend terminal for errors
- Verify database was created (`backend/treasury.db`)
- Try recreating: delete `treasury.db` and restart backend

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **API Testing Guide:** See `backend/API_TESTING.md`
- **Backend Details:** See `backend/BACKEND_SUMMARY.md`

---

## 🎉 Success Indicators

You know everything is working when:

✅ Backend terminal shows:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
Default admin created: username=admin, password=admin123
```

✅ Frontend terminal shows:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

✅ You can access both URLs in your browser

✅ You can login as admin

✅ You can upload and view receipts

---

## 🛑 Stop the Servers

**Backend:** Press `Ctrl+C` in terminal 1
**Frontend:** Press `Ctrl+C` in terminal 2

---

## 🔄 Restart the Servers

Simply run the commands again:
```bash
# Terminal 1
cd backend && ./run.sh

# Terminal 2
cd frontend && ./run.sh
```

The database and uploads persist between restarts!

---

**Ready to go? Start with Step 1! 🚀**
