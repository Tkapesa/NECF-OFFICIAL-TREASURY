# Church Treasury System

A complete full-stack web application for managing church receipts with automatic OCR extraction. Users can upload receipts, and admins can view and edit extracted information through a secure dashboard.

## 📚 Documentation Index

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - **Complete setup instructions** (START HERE!)
- **[QUICKSTART.md](QUICKSTART.md)** - Quick 3-step setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and diagrams
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete feature list and status
- **[backend/API_TESTING.md](backend/API_TESTING.md)** - API testing guide with examples
- **[backend/BACKEND_SUMMARY.md](backend/BACKEND_SUMMARY.md)** - Backend code documentation
- **[frontend/FRONTEND_SUMMARY.md](frontend/FRONTEND_SUMMARY.md)** - Frontend code documentation

## ✨ Features

### User Side
- 📸 Upload receipt images (JPG, PNG, PDF)
- 📝 Enter user information (name, phone, item, approver)
- 🤖 Automatic OCR extraction (price, date, time)
- ✅ Instant confirmation with extracted data
- 🎨 Clean, intuitive interface with maroon theme

### Admin Side
- 🔐 Secure JWT-based authentication
- 📊 Dashboard with all receipts in table view
- 🖼️ Receipt image thumbnails (click to enlarge)
- ✏️ Inline editing of OCR-extracted fields
- 💾 Auto-save functionality
- 🔄 Refresh and logout capabilities

## 🎨 Tech Stack

- **Frontend**: React 18 + Vite + Material UI (MUI)
- **Backend**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy
- **OCR**: Tesseract OCR (pytesseract)
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: Local file system

## 🎯 Features

### User Side
- Upload receipt images (JPG, PNG, PDF)
- Fill in user information (name, phone, item, approver)
- Automatic OCR extraction of price, date, and time
- Simple, clean interface with maroon-white-black theme

### Admin Side
- Secure JWT-based login
- Dashboard with all submitted receipts
- View receipt images and user information
- Inline editing of OCR-extracted fields
- Auto-save functionality

## 📁 Project Structure

```
church-treasury/
├── backend/
│   ├── main.py              # FastAPI app, routes, JWT auth
│   ├── database.py          # SQLAlchemy + SQLite setup
│   ├── models.py            # Receipt + Admin models
│   ├── ocr_utils.py         # Tesseract OCR logic
│   ├── requirements.txt     # Python dependencies
│   └── uploads/             # Receipt image storage
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          # Main app with routing
│       ├── api.js           # Axios instance
│       ├── pages/
│       │   ├── UploadPage.jsx
│       │   └── AdminDashboard.jsx
│       └── components/
│           ├── ReceiptUploadForm.jsx
│           └── ReceiptTable.jsx
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites

1. **Python 3.10+** installed ([Download](https://www.python.org/downloads/))
2. **Node.js 18+** and npm installed ([Download](https://nodejs.org/))
3. **Tesseract OCR** installed on your system:

   **macOS:**
   ```bash
   brew install tesseract
   ```

   **Ubuntu/Debian:**
   ```bash
   sudo apt-get install tesseract-ocr
   ```

   **Windows:**
   Download installer from: https://github.com/UB-Mannheim/tesseract/wiki

### Quick Start (Using Run Scripts)

#### Option 1: Automated Setup (Recommended)

**Backend:**
```bash
cd backend
./run.sh          # macOS/Linux
# OR
.\run.ps1         # Windows PowerShell
```
✅ Server starts at http://localhost:8000

**Frontend (New Terminal):**
```bash
cd frontend
./run.sh          # macOS/Linux
# OR
npm install && npm run dev  # Windows
```
✅ App starts at http://localhost:5173

#### Option 2: Manual Setup

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. (Optional) Configure environment:
   ```bash
   cp ../.env.example .env
   # Edit .env with your settings
   ```

5. Run the FastAPI server:
   ```bash
   # Option A: With uvicorn (recommended for development)
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Option B: Direct Python execution
   python main.py
   ```

   Backend will start at: **http://localhost:8000**
   - API Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Frontend Setup

1. Open a new terminal and navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will start at: **http://localhost:5173**

## 🔐 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

### Change Admin Password

**Method 1: In Code**
Edit `backend/main.py` in the `startup_event()` function:
```python
admin = Admin(
    username="your_new_username",
    hashed_password=hash_password("your_secure_password")
)
```

**Method 2: Using Python Shell**
```bash
cd backend
source venv/bin/activate
python

>>> from database import get_db
>>> from models import Admin
>>> from passlib.context import CryptContext
>>> 
>>> pwd_context = CryptContext(schemes=["bcrypt"])
>>> db = next(get_db())
>>> 
>>> # Update existing admin
>>> admin = db.query(Admin).filter(Admin.username == "admin").first()
>>> admin.hashed_password = pwd_context.hash("new_password")
>>> db.commit()
>>> print("Password updated!")
```

## ⚙️ Environment Configuration

### Setting up .env (Optional)

1. Copy the example file:
   ```bash
   cp .env.example backend/.env
   ```

2. Generate a secure JWT secret:
   ```bash
   # Using OpenSSL
   openssl rand -hex 32
   
   # Using Python
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. Update `backend/.env`:
   ```bash
   JWT_SECRET_KEY=<your-generated-secret-key>
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440
   DATABASE_URL=sqlite:///./treasury.db
   CORS_ORIGINS=http://localhost:5173
   DEFAULT_ADMIN_USERNAME=admin
   DEFAULT_ADMIN_PASSWORD=admin123
   ```

### Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET_KEY` | Secret key for JWT tokens | (must set in production) |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 1440 (24 hours) |
| `DATABASE_URL` | Database connection string | sqlite:///./treasury.db |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:5173 |
| `DEFAULT_ADMIN_USERNAME` | Initial admin username | admin |
| `DEFAULT_ADMIN_PASSWORD` | Initial admin password | admin123 |
| `MAX_UPLOAD_SIZE` | Max file upload size (bytes) | 10485760 (10MB) |

## 📖 Usage Guide

### For Users (Receipt Upload)

1. Open **http://localhost:5173** in your browser
2. You'll see the upload page with a maroon header
3. Click "Upload Receipt Image" and select a receipt photo
4. Fill in your information:
   - **Your Name:** Enter your full name
   - **Phone Number:** Your contact number
   - **Item Bought:** Description of what was purchased
   - **Who Approved the Purchase:** Name of the approver
5. Click "Submit Receipt"
6. The system will:
   - Upload your image
   - Automatically extract price, date, and time using OCR
   - Save everything to the database
   - Show a success message with extracted data

**Example Upload:**
```
Receipt Image: receipt_20251109.jpg
Your Name: John Doe
Phone Number: +1-234-567-8900
Item Bought: Office Supplies - Printer Paper and Ink
Approved By: Pastor Smith
```

**Success Response:**
```
✓ Receipt uploaded successfully
Receipt ID: 1
OCR extracted: Price: $45.99, Date: 2025-11-09, Time: 14:30
```

### For Admins (Dashboard)

1. Navigate to **http://localhost:5173/admin**
2. The login dialog will appear
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Click "Login"
5. You'll see the dashboard with:
   - All submitted receipts in a table
   - Image thumbnails (click to view full size)
   - User information for each receipt
   - OCR-extracted data (price, date, time)

**Editing OCR Data:**
1. Find the receipt you want to edit
2. Click on any OCR field (Price, Date, or Time)
3. The field becomes editable
4. Modify the value
5. Click the save icon (💾)
6. The data is automatically saved to the database

**Example Edit:**
```
Original:  Price: $45.99
Click on it → Edit to: $48.99
Click save icon
Updated!
```

### API Usage Examples

#### Using curl

**1. Upload a Receipt:**
```bash
curl -X POST http://localhost:8000/api/receipts/upload \
  -F "image=@/path/to/receipt.jpg" \
  -F "user_name=John Doe" \
  -F "user_phone=+1234567890" \
  -F "item_bought=Office Supplies" \
  -F "approved_by=Pastor Smith"
```

**2. Admin Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -F "username=admin" \
  -F "password=admin123"
```

Response will include a JWT token:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**3. Get All Receipts (requires token):**
```bash
TOKEN="your_token_from_login"
curl http://localhost:8000/api/receipts \
  -H "Authorization: Bearer $TOKEN"
```

**4. Update Receipt (requires token):**
```bash
curl -X PUT http://localhost:8000/api/receipts/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ocr_price": 48.99,
    "ocr_date": "2025-11-09",
    "ocr_time": "15:00"
  }'
```

#### Using Python

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Login
response = requests.post(f"{BASE_URL}/api/login", data={
    "username": "admin",
    "password": "admin123"
})
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 2. Get all receipts
response = requests.get(f"{BASE_URL}/api/receipts", headers=headers)
receipts = response.json()["receipts"]
print(f"Found {len(receipts)} receipts")

# 3. Upload receipt
with open("receipt.jpg", "rb") as f:
    files = {"image": f}
    data = {
        "user_name": "John Doe",
        "user_phone": "+1234567890",
        "item_bought": "Office Supplies",
        "approved_by": "Pastor Smith"
    }
    response = requests.post(
        f"{BASE_URL}/api/receipts/upload",
        files=files,
        data=data
    )
    print(response.json())

# 4. Update receipt
response = requests.put(
    f"{BASE_URL}/api/receipts/1",
    headers=headers,
    json={"ocr_price": 48.99}
)
print(response.json())
```

#### Using JavaScript/Axios

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// 1. Login
const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
  username: 'admin',
  password: 'admin123'
}, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

const token = loginResponse.data.access_token;
const headers = { Authorization: `Bearer ${token}` };

// 2. Get receipts
const receiptsResponse = await axios.get(`${BASE_URL}/api/receipts`, { headers });
console.log(receiptsResponse.data.receipts);

// 3. Upload receipt
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('user_name', 'John Doe');
formData.append('user_phone', '+1234567890');
formData.append('item_bought', 'Office Supplies');
formData.append('approved_by', 'Pastor Smith');

const uploadResponse = await axios.post(
  `${BASE_URL}/api/receipts/upload`,
  formData,
  { headers: { 'Content-Type': 'multipart/form-data' } }
);
console.log(uploadResponse.data);

// 4. Update receipt
const updateResponse = await axios.put(
  `${BASE_URL}/api/receipts/1`,
  { ocr_price: 48.99 },
  { headers }
);
console.log(updateResponse.data);
```

## 🎨 Color Theme

- **Primary:** Maroon (#800000)
- **Secondary:** Black (#000000)
- **Background:** White (#FFFFFF)

## 📡 API Endpoints

### Public Endpoints
- `POST /api/receipts/upload` - Upload receipt (multipart/form-data)
  - Form fields: `image`, `user_name`, `user_phone`, `item_bought`, `approved_by`
  - Returns: Receipt ID and OCR extracted data

### Admin Endpoints (Requires JWT Token)
- `POST /api/login` - Admin login
  - Form fields: `username`, `password`
  - Returns: JWT access token
  
- `GET /api/receipts` - Get all receipts
  - Auth: Bearer token in Authorization header
  - Returns: Array of all receipts with extracted data

- `PUT /api/receipts/{id}` - Update OCR fields
  - Auth: Bearer token in Authorization header
  - Body: `ocr_price`, `ocr_date`, `ocr_time` (all optional)
  - Returns: Success message

### Authentication Method
The API uses **fastapi-jwt-auth** for JWT authentication. Tokens are sent via:
- **Authorization header:** `Authorization: Bearer <token>`
- **Query parameter:** `?token=<token>` (fallback)

## 🗄️ Database Schema

### Admins Table
```sql
CREATE TABLE admins (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Receipts Table
```sql
CREATE TABLE receipts (
    id INTEGER PRIMARY KEY,
    
    -- User-submitted fields
    user_name VARCHAR NOT NULL,
    user_phone VARCHAR NOT NULL,
    item_bought VARCHAR NOT NULL,
    approved_by VARCHAR NOT NULL,
    
    -- OCR extracted fields (editable by admin)
    ocr_price FLOAT,
    ocr_date VARCHAR,
    ocr_time VARCHAR,
    ocr_raw_text TEXT,
    
    -- Receipt image
    image_path VARCHAR NOT NULL,
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Database Management

**View Database:**
```bash
cd backend
sqlite3 treasury.db

.tables                  # Show all tables
SELECT * FROM admins;    # View admins
SELECT * FROM receipts;  # View receipts
.quit                    # Exit
```

**Backup Database:**
```bash
cp backend/treasury.db backend/treasury_backup_$(date +%Y%m%d).db
```

**Reset Database:**
```bash
cd backend
rm treasury.db
python main.py  # Recreates with default admin
```

## 🛠️ Development Notes

### OCR Configuration
The OCR extraction logic is in `backend/ocr_utils.py`. You can customize the regex patterns to match your receipt format better.

### Adding More Admins
To add more admin users, you can modify the `startup_event()` function in `backend/main.py` or create a separate admin creation script.

### Image Storage
Receipt images are stored in `backend/uploads/` with timestamped filenames. For production, consider using cloud storage (S3, Google Cloud Storage, etc.).

## 📦 Building for Production

### Security Checklist

**Before deploying to production:**

1. **Change Default Admin Credentials**
   ```bash
   # In .env file
   DEFAULT_ADMIN_USERNAME=your_secure_username
   DEFAULT_ADMIN_PASSWORD=your_strong_password_here
   ```

2. **Generate Strong JWT Secret**
   ```bash
   # Use cryptographically secure random string
   openssl rand -hex 32
   # Copy output to JWT_SECRET_KEY in .env
   ```

3. **Update CORS Origins**
   ```bash
   # In .env file
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

4. **Secure File Permissions**
   ```bash
   chmod 600 .env
   chmod 700 backend/uploads
   chmod 600 backend/treasury.db
   ```

### Frontend Build
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/` - these are static files ready to be served by Nginx, Apache, or a CDN.

### Backend Production Server
Use a production ASGI server with multiple workers:
```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Deployment Options

**Option 1: VPS (DigitalOcean, Linode, AWS EC2)**
- Backend: Gunicorn + Uvicorn workers behind Nginx
- Frontend: Serve `dist/` folder with Nginx
- SSL: Let's Encrypt (certbot)

**Option 2: Docker**
- Use `docker-compose.yml` for multi-container setup
- Mount volumes for uploads and database

**Option 3: Serverless**
- Backend: AWS Lambda with Mangum adapter
- Frontend: S3 + CloudFront
- Database: RDS PostgreSQL (not SQLite)

### Render Configuration

**CRITICAL: Root Directory Setting**

When deploying to Render, ensure the **Root Directory** is set correctly:

```
✅ Root Directory: backend
```

**Common Mistakes:**
- ❌ `backend/aptfile` (this is a file, not a directory)
- ❌ Empty (Render won't find aptfile)

**Verify:** Check that `render.yaml` has `rootDir: backend` uncommented.

See [RENDER_ROOT_DIRECTORY_FIX.md](RENDER_ROOT_DIRECTORY_FIX.md) for troubleshooting.

#### Frontend Deployment on Render

**Step 1: Create Static Site Service**

1. Go to Render Dashboard → New → Static Site
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** `necf-frontend` (or your choice)
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

**Step 2: Configure Environment Variables**

Add the following environment variable in Render dashboard:

```bash
VITE_API_URL=https://your-backend-service.onrender.com/api
```

**Example:**
```bash
VITE_API_URL=https://necf-official-treasury-1-dbyt.onrender.com/api
```

**Step 3: Update Backend CORS**

In your backend `.env` or Render environment variables, add the frontend URL:

```bash
CORS_ORIGINS=https://your-frontend.onrender.com,https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.onrender.com
```

**Example:**
```bash
CORS_ORIGINS=https://necf-1.onrender.com,https://necf-official-treasury-1-dbyt.onrender.com
FRONTEND_URL=https://necf-1.onrender.com
```

#### Verifying the Deployment

After deployment, check the browser console to verify the API connection:

1. Open your frontend URL (e.g., `https://necf-1.onrender.com`)
2. Open browser Developer Tools (F12)
3. Check the Console tab for these messages:
   ```
   [API] Using baseURL: https://necf-official-treasury-1-dbyt.onrender.com/api
   [API] Environment: production
   [API] VITE_API_URL from env: https://necf-official-treasury-1-dbyt.onrender.com/api
   ```

4. Test the connection:
   - Go to `/admin` and login
   - Upload a receipt
   - Check for any CORS or connection errors in console

#### Troubleshooting Deployment Issues

**Issue: "Failed to load admins"**
- ✅ Verify `VITE_API_URL` is set correctly in Render frontend environment
- ✅ Check backend CORS allows frontend domain
- ✅ Ensure backend is deployed and running
- ✅ Check browser console for API errors

**Issue: CORS errors**
- ✅ Update backend `CORS_ORIGINS` to include frontend URL
- ✅ Redeploy backend after updating CORS
- ✅ Clear browser cache (hard refresh: Ctrl+Shift+R)

**Issue: Wrong API URL in production**
- ✅ Check `frontend/.env.production` has correct backend URL
- ✅ Verify Render environment variable `VITE_API_URL` is set
- ✅ Rebuild and redeploy frontend
- ✅ Check browser console logs for actual URL being used

### Additional Production Considerations
- Use PostgreSQL or MySQL instead of SQLite for better concurrency
- Implement rate limiting to prevent abuse
- Set up automated database backups
- Add logging and monitoring (Sentry, CloudWatch, etc.)
- Use CDN for static assets
- Implement proper error handling and alerting

## 🐛 Troubleshooting

### Tesseract Not Found Error
**Error:** `pytesseract.pytesseract.TesseractNotFoundError`

**Solution:**
- Make sure Tesseract is installed and in your PATH
- **macOS/Linux:** `which tesseract` should show the path
- **Windows:** Set the path in `ocr_utils.py`:
  ```python
  pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
  ```

### Port Already in Use
**Error:** `Address already in use: 8000` or `5173`

**Solution:**
```bash
# macOS/Linux - Kill process on port
lsof -ti:8000 | xargs kill -9    # Backend
lsof -ti:5173 | xargs kill -9    # Frontend

# Windows - Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CORS Errors
**Error:** Browser console shows CORS policy error

**Solutions:**
1. Ensure both frontend (port 5173) and backend (port 8000) are running
2. Check CORS settings in `backend/main.py`:
   ```python
   allow_origins=["http://localhost:5173"]
   ```
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Module Not Found
**Backend Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend Error:** `Cannot find module '@mui/material'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Locked
**Error:** `sqlite3.OperationalError: database is locked`

**Solution:**
```bash
cd backend
# Stop the server (Ctrl+C)
rm treasury.db
python main.py  # Will recreate database
```

### OCR Not Extracting Data
**Issue:** All OCR fields are null/empty

**Solutions:**
1. **Check image quality:**
   - Image must be clear and readable
   - Good lighting
   - Text not blurry or rotated

2. **Test Tesseract directly:**
   ```bash
   tesseract receipt.jpg output
   cat output.txt
   ```

3. **Adjust OCR patterns:**
   - Edit `backend/ocr_utils.py`
   - Modify regex patterns to match your receipt format

### Login Fails
**Issue:** "Invalid credentials" with correct password

**Solution:**
```bash
cd backend
rm treasury.db
python main.py  # Recreates database with fresh admin
```

### Permission Denied on run.sh
**Error:** `Permission denied: ./run.sh`

**Solution:**
```bash
chmod +x backend/run.sh
chmod +x frontend/run.sh
```

### Virtual Environment Issues
**Error:** `Command 'venv' not found`

**Solution (Ubuntu/Debian):**
```bash
sudo apt install python3.10-venv
```

For more detailed troubleshooting, see **[SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)**

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Areas for improvement:**
- Additional OCR languages support
- Export to Excel/CSV functionality  
- Email notifications
- Multi-admin support with roles
- Advanced search and filtering
- Receipt categories/tags
- Budget tracking features

## 📝 Project Status

✅ **Current Version:** 1.0.0

**Completed Features:**
- Receipt upload with image preview
- OCR extraction (price, date, time)
- Admin authentication with JWT
- Editable admin dashboard
- Maroon-themed Material-UI interface
- SQLite database with auto-seeding
- Comprehensive documentation

**Planned Features:**
- Excel/CSV export
- Receipt categories
- Advanced filtering
- Email notifications
- Multi-admin roles

## 📄 License

This project is open source and available for church use.

## 🙏 Support

For issues or questions:
1. Check the [SETUP_GUIDE.md](SETUP_GUIDE.md) for installation help
2. Review the [Troubleshooting](#-troubleshooting) section
3. Create an issue in the repository

## 📞 Contact

Built with ❤️ for church treasury management

---

**Quick Links:**
- [Setup Guide](SETUP_GUIDE.md) - Complete installation instructions
- [Architecture](ARCHITECTURE.md) - System design and diagrams
- [Backend Documentation](backend/BACKEND_SUMMARY.md)
- [Frontend Documentation](frontend/FRONTEND_SUMMARY.md)
- [API Testing Guide](backend/API_TESTING.md)
