"""
FastAPI backend for Church Treasury System
"""
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import bcrypt
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
import shutil
import os
import re
from typing import Optional
import subprocess
import traceback

from database import get_db, init_db
from models import Receipt, Admin
from ocr_utils import extract_receipt_data
import pytesseract

# JWT Configuration
class Settings(BaseModel):
    authjwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production-please")
    authjwt_token_location: set = {"headers"}
    authjwt_access_token_expires: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "1440")) * 60

# Receipt Update Model
class ReceiptUpdate(BaseModel):
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    item_bought: Optional[str] = None
    approved_by: Optional[str] = None
    ocr_price: Optional[float] = None
    ocr_date: Optional[str] = None
    ocr_time: Optional[str] = None
    
    class Config:
        # Allow extra fields and don't validate None values
        extra = "ignore"

@AuthJWT.load_config
def get_config():
    return Settings()

# Password hashing using bcrypt directly (avoids passlib backend issues)
def hash_password(password: str) -> str:
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if isinstance(plain_password, str):
        plain_bytes = plain_password.encode('utf-8')
    else:
        plain_bytes = plain_password
    if isinstance(hashed_password, str):
        hash_bytes = hashed_password.encode('utf-8')
    else:
        hash_bytes = hashed_password
    try:
        return bcrypt.checkpw(plain_bytes, hash_bytes)
    except ValueError:
        return False

# File upload configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
print(f"📁 Upload directory: {UPLOAD_DIR}")

# Initialize FastAPI app
app = FastAPI(title="Church Treasury System")

# CORS middleware for React frontend
cors_origins_env = os.getenv("CORS_ORIGINS", "").strip()

if cors_origins_env:
    if cors_origins_env == "*":
        allow_origins = ["*"]
        print("⚠️  WARNING: CORS set to allow ALL origins (*) - not recommended for production!")
    else:
        allow_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
        print(f"🔒 CORS restricted to: {', '.join(allow_origins)}")
else:
    # Default fallback origins
    allow_origins = [
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "https://necftreausry.com",
        "https://www.necftreausry.com",
    ]
    print("⚠️  CORS_ORIGINS not set - using default localhost + production domains")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],  # Expose only necessary headers
)

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    """Initialize database and perform startup checks"""
    print("=" * 60)
    print("🚀 NECF Treasury Backend Starting Up...")
    print("=" * 60)
    
    # 1. Validate critical environment variables
    print("\n📋 Checking environment variables...")
    required_vars = {
        "DATABASE_URL": os.getenv("DATABASE_URL"),
        "JWT_SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
        "DEFAULT_ADMIN_PASSWORD": os.getenv("DEFAULT_ADMIN_PASSWORD")
    }
    
    missing_vars = [key for key, value in required_vars.items() if not value]
    if missing_vars:
        print(f"❌ ERROR: Missing required environment variables: {', '.join(missing_vars)}")
        print("⚠️  Backend will start but functionality may be limited!")
    else:
        print("✅ All required environment variables are set")
    
    # 2. Check database connection
    print("\n🔌 Connecting to database...")
    db_url = os.getenv("DATABASE_URL", "sqlite:///./treasury.db")
    
    if db_url.startswith("postgresql://"):
        print(f"✅ Using PostgreSQL database")
    elif db_url.startswith("sqlite://"):
        print(f"⚠️  WARNING: Using SQLite (data will be lost on restart!)")
    else:
        print(f"⚠️  WARNING: Unknown database type: {db_url[:20]}...")
    
    # 3. Initialize database tables
    print("\n📊 Initializing database tables...")
    try:
        init_db()
        print("✅ Database tables initialized successfully")
    except Exception as e:
        print(f"❌ ERROR: Failed to initialize database: {str(e)}")
        print(f"Full error: {traceback.format_exc()}")
    
    # 4. Seed default admin user
    print("\n👤 Checking admin user...")
    try:
        db = next(get_db())
        admin_username = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
        admin = db.query(Admin).filter(Admin.username == admin_username).first()
        
        if not admin:
            admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD")
            if admin_password:
                hashed_password = hash_password(admin_password)
                new_admin = Admin(
                    username=admin_username,
                    hashed_password=hashed_password,
                    is_superuser=True
                )
                db.add(new_admin)
                db.commit()
                print(f"✅ Created default admin user: {admin_username}")
            else:
                print("⚠️  WARNING: DEFAULT_ADMIN_PASSWORD not set - admin user not created!")
        else:
            print(f"✅ Admin user exists: {admin_username}")
            # Ensure admin is superuser
            if not admin.is_superuser:
                admin.is_superuser = True
                db.commit()
                print(f"✅ Upgraded admin user to superuser: {admin_username}")
        
        db.close()
    except Exception as e:
        print(f"❌ ERROR: Failed to check/create admin user: {str(e)}")
        print(f"Full error: {traceback.format_exc()}")
    
    # 5. Display CORS configuration
    print("\n🌐 CORS Configuration:")
    cors_origins = os.getenv("CORS_ORIGINS", "").strip()
    if cors_origins:
        origins = [o.strip() for o in cors_origins.split(",")]
        print(f"✅ Allowing requests from: {', '.join(origins)}")
    else:
        print("⚠️  Using default CORS origins (localhost only)")
    
    print("\n" + "=" * 60)
    print("✅ Startup complete! Backend is ready.")
    print("=" * 60)


# ============ AUTH UTILITIES ============

    


def validate_strong_password(password: str) -> bool:
    """
    Validate password strength:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        raise HTTPException(
            status_code=400, 
            detail="Password must be at least 8 characters long"
        )
    
    if not re.search(r'[A-Z]', password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter"
        )
    
    if not re.search(r'[a-z]', password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter"
        )
    
    if not re.search(r'[0-9]', password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one number"
        )
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>/?]', password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character (!@#$%^&*...)"
        )
    
    return True


# ============ API ROUTES ============

@app.get("/")
def root():
    """Health check"""
    return {"message": "Church Treasury System API", "status": "running"}


@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint - verifies database connection and service status
    """
    try:
        # Try to query the database - using simple query for performance
        admin_count = db.query(Admin).count()
        receipt_count = db.query(Receipt).count()
        
        return {
            "status": "healthy",
            "database": "connected",
            "tables": {
                "admins": admin_count,
                "receipts": receipt_count
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        # Log the full error server-side for debugging
        print(f"❌ Health check failed: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Return generic error to client
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": "Database connection failed",
            "timestamp": datetime.now().isoformat()
        }


@app.get("/api/debug/tesseract")
async def check_tesseract():
    """Debug endpoint to verify Tesseract installation - PUBLIC ACCESS"""
    import subprocess
    
    try:
        result = subprocess.run(
            ["tesseract", "--version"], 
            capture_output=True, 
            text=True,
            timeout=5
        )
        return {
            "tesseract_installed": True,
            "version": result.stdout,
            "stderr": result.stderr,
            "path": "/usr/bin/tesseract",
            "pytesseract_cmd": pytesseract.pytesseract.tesseract_cmd
        }
    except FileNotFoundError:
        return {
            "tesseract_installed": False,
            "error": "Tesseract binary not found",
            "searched_path": "/usr/bin/tesseract",
            "pytesseract_cmd": pytesseract.pytesseract.tesseract_cmd
        }
    except Exception as e:
        return {
            "tesseract_installed": False,
            "error": str(e),
            "error_type": type(e).__name__
        }


@app.post("/api/login")
def login(username: str = Form(...), password: str = Form(...), 
          db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    """Admin login endpoint"""
    print(f"🔐 Login attempt - Username: '{username}', Password length: {len(password)}")
    
    admin = db.query(Admin).filter(Admin.username == username).first()
    
    if not admin:
        print(f"❌ Admin user '{username}' not found in database")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    print(f"✅ Admin user found: {admin.username}")
    print(f"🔑 Stored hash: {admin.hashed_password[:20]}...")
    
    password_valid = verify_password(password, admin.hashed_password)
    print(f"🔓 Password verification result: {password_valid}")
    
    if not password_valid:
        print(f"❌ Password verification failed for user '{username}'")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token with additional user info
    access_token = Authorize.create_access_token(
        subject=admin.username,
        user_claims={"is_superuser": admin.is_superuser, "admin_id": admin.id}
    )
    print(f"✅ Login successful for user '{username}' (Superuser: {admin.is_superuser})")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_superuser": admin.is_superuser,
        "username": admin.username
    }


# ============ ADMIN MANAGEMENT ROUTES (SUPERUSER ONLY) ============

@app.get("/api/admins")
def get_admins(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    """Superuser endpoint to get all admins"""
    
    try:
        # Verify token
        Authorize.jwt_required()
        current_username = Authorize.get_jwt_subject()
        claims = Authorize.get_raw_jwt()
        
        print(f"👤 User '{current_username}' requesting admin list (Superuser: {claims.get('is_superuser', False)})")
        
        # Check if superuser
        if not claims.get("is_superuser", False):
            print(f"❌ Access denied: User '{current_username}' is not a superuser")
            raise HTTPException(status_code=403, detail="Superuser access required")
        
        admins = db.query(Admin).order_by(Admin.created_at.desc()).all()
        
        print(f"✅ Returning {len(admins)} admin accounts")
        
        return {
            "admins": [
                {
                    "id": a.id,
                    "username": a.username,
                    "is_superuser": a.is_superuser,
                    "created_at": a.created_at.isoformat()
                }
                for a in admins
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching admins: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch admins: {str(e)}")


@app.post("/api/admins")
def create_admin(
    username: str = Form(...),
    password: str = Form(...),
    is_superuser: bool = Form(False),
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends()
):
    """Superuser endpoint to create new admin"""
    
    # Verify token
    Authorize.jwt_required()
    current_username = Authorize.get_jwt_subject()
    claims = Authorize.get_raw_jwt()
    
    # Check if superuser
    if not claims.get("is_superuser", False):
        raise HTTPException(status_code=403, detail="Superuser access required")
    
    # Check if username already exists
    existing_admin = db.query(Admin).filter(Admin.username == username).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Validate strong password
    validate_strong_password(password)
    
    # Create new admin
    new_admin = Admin(
        username=username,
        hashed_password=hash_password(password),
        is_superuser=is_superuser
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    print(f"✅ New admin created by {current_username}: {username} (Superuser: {is_superuser})")
    
    return {
        "message": "Admin created successfully",
        "admin": {
            "id": new_admin.id,
            "username": new_admin.username,
            "is_superuser": new_admin.is_superuser,
            "created_at": new_admin.created_at.isoformat()
        }
    }


@app.delete("/api/admins/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends()
):
    """Superuser endpoint to delete an admin"""
    
    # Verify token
    Authorize.jwt_required()
    current_username = Authorize.get_jwt_subject()
    claims = Authorize.get_raw_jwt()
    
    # Check if superuser
    if not claims.get("is_superuser", False):
        raise HTTPException(status_code=403, detail="Superuser access required")
    
    # Prevent deleting self
    if claims.get("admin_id") == admin_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Prevent deleting the last superuser
    if admin.is_superuser:
        superuser_count = db.query(Admin).filter(Admin.is_superuser == True).count()
        if superuser_count <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last superuser")
    
    username_deleted = admin.username
    db.delete(admin)
    db.commit()
    
    print(f"✅ Admin deleted by {current_username}: {username_deleted}")
    
    return {
        "message": "Admin deleted successfully",
        "username": username_deleted
    }


# ============ RECEIPT ROUTES ============

@app.post("/api/receipts/upload")
async def upload_receipt(
    image: UploadFile = File(...),
    user_name: str = Form(...),
    user_phone: str = Form(...),
    item_bought: str = Form(...),
    approved_by: str = Form(...),
    db: Session = Depends(get_db)
):
    """User endpoint to upload receipt"""
    
    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")
    
    # Save uploaded image
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{image.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    print(f"📸 Saving image to: {file_path}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    print(f"✅ Image saved successfully: {file_path}")
    print(f"🔍 Running OCR on image...")
    
    # Run OCR on the image
    ocr_data = extract_receipt_data(file_path)
    
    print(f"📊 OCR Results:")
    print(f"   - Price: {ocr_data.get('ocr_price')}")
    print(f"   - Date: {ocr_data.get('ocr_date')}")
    print(f"   - Time: {ocr_data.get('ocr_time')}")
    print(f"   - Raw text length: {len(ocr_data.get('ocr_raw_text', ''))}")
    
    # Create receipt record
    receipt = Receipt(
        user_name=user_name,
        user_phone=user_phone,
        item_bought=item_bought,
        approved_by=approved_by,
        image_path=file_path,
        **ocr_data
    )
    
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    
    print(f"💾 Receipt saved to database with ID: {receipt.id}")
    
    return {
        "message": "Receipt uploaded successfully",
        "receipt_id": receipt.id,
        "ocr_data": ocr_data
    }


@app.get("/api/receipts")
def get_receipts(request: Request, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    """Admin endpoint to get all receipts"""
    
    try:
        # Verify admin token
        print(f"🔐 Verifying JWT token for /api/receipts endpoint")
        Authorize.jwt_required()
        current_user = Authorize.get_jwt_subject()
        print(f"✅ JWT verified for user: {current_user}")
        
        receipts = db.query(Receipt).order_by(Receipt.created_at.desc()).all()
        
        print(f"📋 Fetched {len(receipts)} receipts from database")
        
        return {
            "receipts": [
                {
                    "id": r.id,
                    "user_name": r.user_name,
                    "user_phone": r.user_phone,
                    "item_bought": r.item_bought,
                    "approved_by": r.approved_by,
                    "ocr_price": r.ocr_price,
                    "ocr_date": r.ocr_date,
                    "ocr_time": r.ocr_time,
                    "ocr_raw_text": r.ocr_raw_text,
                    # Build absolute image URL dynamically (avoids hardcoded localhost)
                    "image_path": f"{str(request.base_url).rstrip('/')}/{r.image_path}",
                    "created_at": r.created_at.isoformat()
                }
                for r in receipts
            ]
        }
    except HTTPException as http_err:
        print(f"❌ HTTP Error in /api/receipts: {http_err.status_code} - {http_err.detail}")
        raise
    except Exception as e:
        print(f"❌ Unexpected error fetching receipts: {str(e)}")
        print(f"Exception type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to fetch receipts: {str(e)}")


@app.put("/api/receipts/{receipt_id}")
def update_receipt(
    receipt_id: int,
    update_data: ReceiptUpdate,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends()
):
    """Admin endpoint to update receipt fields"""
    
    # Verify admin token
    Authorize.jwt_required()
    
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    
    # Update user-submitted fields if provided and not empty
    if update_data.user_name is not None and update_data.user_name != "":
        receipt.user_name = update_data.user_name
    if update_data.user_phone is not None and update_data.user_phone != "":
        receipt.user_phone = update_data.user_phone
    if update_data.item_bought is not None and update_data.item_bought != "":
        receipt.item_bought = update_data.item_bought
    if update_data.approved_by is not None and update_data.approved_by != "":
        receipt.approved_by = update_data.approved_by
    
    # Update OCR fields if provided (allow empty for OCR fields)
    if update_data.ocr_price is not None:
        receipt.ocr_price = update_data.ocr_price
    if update_data.ocr_date is not None and update_data.ocr_date != "":
        receipt.ocr_date = update_data.ocr_date
    if update_data.ocr_time is not None and update_data.ocr_time != "":
        receipt.ocr_time = update_data.ocr_time
    
    # Update timestamp
    receipt.updated_at = datetime.now()
    
    db.commit()
    db.refresh(receipt)
    
    return {
        "message": "Receipt updated successfully",
        "receipt": {
            "id": receipt.id,
            "user_name": receipt.user_name,
            "user_phone": receipt.user_phone,
            "item_bought": receipt.item_bought,
            "approved_by": receipt.approved_by,
            "ocr_price": receipt.ocr_price,
            "ocr_date": receipt.ocr_date,
            "ocr_time": receipt.ocr_time,
            "updated_at": receipt.updated_at.isoformat()
        }
    }


@app.delete("/api/receipts/{receipt_id}")
def delete_receipt(
    receipt_id: int,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends()
):
    """Admin endpoint to delete a single receipt"""
    
    # Verify admin token
    Authorize.jwt_required()
    
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    
    if not receipt:
        raise HTTPException(status_code=404, detail="Receipt not found")
    
    # Delete the image file if it exists
    if receipt.image_path and os.path.exists(receipt.image_path):
        try:
            os.remove(receipt.image_path)
        except Exception as e:
            print(f"Error deleting image file: {e}")
    
    # Delete from database
    db.delete(receipt)
    db.commit()
    
    return {
        "message": "Receipt deleted successfully",
        "id": receipt_id
    }


@app.post("/api/receipts/bulk-delete")
def bulk_delete_receipts(
    receipt_ids: list[int],
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends()
):
    """Admin endpoint to delete multiple receipts"""
    
    # Verify admin token
    Authorize.jwt_required()
    
    if not receipt_ids:
        raise HTTPException(status_code=400, detail="No receipt IDs provided")
    
    deleted_count = 0
    errors = []
    
    for receipt_id in receipt_ids:
        receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
        
        if receipt:
            # Delete the image file if it exists
            if receipt.image_path and os.path.exists(receipt.image_path):
                try:
                    os.remove(receipt.image_path)
                except Exception as e:
                    errors.append(f"Error deleting image for receipt {receipt_id}: {e}")
            
            # Delete from database
            db.delete(receipt)
            deleted_count += 1
        else:
            errors.append(f"Receipt {receipt_id} not found")
    
    db.commit()
    
    return {
        "message": f"Deleted {deleted_count} receipt(s) successfully",
        "deleted_count": deleted_count,
        "errors": errors if errors else None
    }


# ============ FRONTEND STATIC (OPTIONAL) ============

FRONTEND_DIST = os.getenv(
    "FRONTEND_DIST",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
)

if os.getenv("SERVE_FRONTEND", "0") == "1" and os.path.isdir(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
