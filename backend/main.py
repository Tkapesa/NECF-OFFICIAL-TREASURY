"""
FastAPI backend for Church Treasury System
Fully refactored for maintainability, clarity, and security
"""
import os
import re
import shutil
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel

from database import get_db, init_db
from models import Receipt, Admin
from ocr_utils import extract_receipt_data

# ================= CONFIG =================

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")  # for image URLs
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-this-in-production-please")

# ================= JWT SETTINGS =================

class Settings(BaseModel):
    authjwt_secret_key: str = JWT_SECRET
    authjwt_token_location: set = {"headers"}
    authjwt_access_token_expires: int = 24 * 60 * 60  # 24 hours

@AuthJWT.load_config
def get_config():
    return Settings()

# ================= PASSWORD UTILITIES =================

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def validate_strong_password(password: str) -> bool:
    if len(password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters long")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(400, "Password must contain an uppercase letter")
    if not re.search(r"[a-z]", password):
        raise HTTPException(400, "Password must contain a lowercase letter")
    if not re.search(r"[0-9]", password):
        raise HTTPException(400, "Password must contain a number")
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", password):
        raise HTTPException(400, "Password must contain a special character")
    return True

# ================= FASTAPI APP =================

app = FastAPI(title="Church Treasury System")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploaded images
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# ================= Pydantic MODELS =================

class ReceiptUpdate(BaseModel):
    user_name: Optional[str] = None
    user_phone: Optional[str] = None
    item_bought: Optional[str] = None
    approved_by: Optional[str] = None
    ocr_price: Optional[float] = None
    ocr_date: Optional[str] = None
    ocr_time: Optional[str] = None
    class Config:
        extra = "ignore"

class CreateAdmin(BaseModel):
    username: str
    password: str
    is_superuser: bool = False

# ================= HELPERS =================

def get_full_image_url(path: str) -> str:
    return f"{BASE_URL}/{path}"

def get_current_admin(Authorize: AuthJWT = Depends()) -> dict:
    Authorize.jwt_required()
    claims = Authorize.get_raw_jwt()
    return claims  # contains username, admin_id, is_superuser

def require_superuser(claims: dict):
    if not claims.get("is_superuser", False):
        raise HTTPException(403, "Superuser access required")

# ================= STARTUP EVENT =================

@app.on_event("startup")
def startup_event():
    init_db()
    db = next(get_db())
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin:
        new_admin = Admin(
            username="admin",
            hashed_password=hash_password("admin123"),
            is_superuser=True
        )
        db.add(new_admin)
        db.commit()
        print("✅ Default SUPERUSER admin created")
    elif not admin.is_superuser:
        admin.is_superuser = True
        db.commit()
        print("✅ Existing admin upgraded to SUPERUSER")

# ================= ROOT =================

@app.get("/")
def root():
    return {"message": "Church Treasury System API running"}

# ================= AUTH =================

@app.post("/api/login")
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin or not verify_password(password, admin.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    token = Authorize.create_access_token(
        subject=admin.username,
        user_claims={"is_superuser": admin.is_superuser, "admin_id": admin.id}
    )
    return {"access_token": token, "token_type": "bearer", "is_superuser": admin.is_superuser, "username": admin.username}

# ================= ADMIN MANAGEMENT =================

@app.get("/api/admins")
def get_admins(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    claims = get_current_admin(Authorize)
    require_superuser(claims)
    admins = db.query(Admin).order_by(Admin.created_at.desc()).all()
    return {"admins": [{"id": a.id, "username": a.username, "is_superuser": a.is_superuser, "created_at": a.created_at.isoformat()} for a in admins]}

@app.post("/api/admins")
def create_admin(admin_data: CreateAdmin = Depends(), db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    claims = get_current_admin(Authorize)
    require_superuser(claims)
    if db.query(Admin).filter(Admin.username == admin_data.username).first():
        raise HTTPException(400, "Username already exists")
    validate_strong_password(admin_data.password)
    new_admin = Admin(username=admin_data.username, hashed_password=hash_password(admin_data.password), is_superuser=admin_data.is_superuser)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Admin created", "admin": {"id": new_admin.id, "username": new_admin.username, "is_superuser": new_admin.is_superuser, "created_at": new_admin.created_at.isoformat()}}

@app.delete("/api/admins/{admin_id}")
def delete_admin(admin_id: int, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    claims = get_current_admin(Authorize)
    require_superuser(claims)
    if claims.get("admin_id") == admin_id:
        raise HTTPException(400, "Cannot delete your own account")
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(404, "Admin not found")
    if admin.is_superuser and db.query(Admin).filter(Admin.is_superuser).count() <= 1:
        raise HTTPException(400, "Cannot delete the last superuser")
    db.delete(admin)
    db.commit()
    return {"message": "Admin deleted", "username": admin.username}

# ================= RECEIPT ROUTES =================

@app.post("/api/receipts/upload")
async def upload_receipt(image: UploadFile = File(...), user_name: str = Form(...), user_phone: str = Form(...), item_bought: str = Form(...), approved_by: str = Form(...), db: Session = Depends(get_db)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{image.filename}"
    file_path = f"{UPLOAD_FOLDER}/{filename}"
    with open(file_path, "wb") as f:
        shutil.copyfileobj(image.file, f)
    ocr_data = extract_receipt_data(file_path)
    receipt = Receipt(user_name=user_name, user_phone=user_phone, item_bought=item_bought, approved_by=approved_by, image_path=file_path, **ocr_data)
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return {"message": "Receipt uploaded", "receipt_id": receipt.id, "ocr_data": ocr_data}

@app.get("/api/receipts")
def get_receipts(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    get_current_admin(Authorize)
    receipts = db.query(Receipt).order_by(Receipt.created_at.desc()).all()
    return {"receipts": [{"id": r.id, "user_name": r.user_name, "user_phone": r.user_phone, "item_bought": r.item_bought, "approved_by": r.approved_by, "ocr_price": r.ocr_price, "ocr_date": r.ocr_date, "ocr_time": r.ocr_time, "ocr_raw_text": r.ocr_raw_text, "image_path": get_full_image_url(r.image_path), "created_at": r.created_at.isoformat()} for r in receipts]}

@app.put("/api/receipts/{receipt_id}")
def update_receipt(receipt_id: int, update_data: ReceiptUpdate, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    get_current_admin(Authorize)
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(404, "Receipt not found")

    # Update fields
    for field in ["user_name", "user_phone", "item_bought", "approved_by", "ocr_price", "ocr_date", "ocr_time"]:
        value = getattr(update_data, field)
        if value is not None:
            setattr(receipt, field, value)
    receipt.updated_at = datetime.now()
    db.commit()
    db.refresh(receipt)

    return {"message": "Receipt updated", "receipt": {"id": receipt.id, "user_name": receipt.user_name, "user_phone": receipt.user_phone, "item_bought": receipt.item_bought, "approved_by": receipt.approved_by, "ocr_price": receipt.ocr_price, "ocr_date": receipt.ocr_date, "ocr_time": receipt.ocr_time, "updated_at": receipt.updated_at.isoformat()}}

@app.delete("/api/receipts/{receipt_id}")
def delete_receipt(receipt_id: int, db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    get_current_admin(Authorize)
    receipt = db.query(Receipt).filter(Receipt.id == receipt_id).first()
    if not receipt:
        raise HTTPException(404, "Receipt not found")
    if receipt.image_path and os.path.exists(receipt.image_path):
        try: os.remove(receipt.image_path)
        except Exception as e: print(f"Error deleting image: {e}")
    db.delete(receipt)
    db.commit()
    return {"message": "Receipt deleted", "id": receipt_id}

@app.post("/api/receipts/bulk-delete")
def bulk_delete_receipts(receipt_ids: List[int], db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    get_current_admin(Authorize)
    if not receipt_ids:
        raise HTTPException(400, "No receipt IDs provided")
    deleted_count = 0
    errors = []
    for rid in receipt_ids:
        r = db.query(Receipt).filter(Receipt.id == rid).first()
        if r:
            if r.image_path and os.path.exists(r.image_path):
                try: os.remove(r.image_path)
                except Exception as e: errors.append(f"Error deleting image {rid}: {e}")
            db.delete(r)
            deleted_count += 1
        else:
            errors.append(f"Receipt {rid} not found")
    db.commit()
    return {"message": f"Deleted {deleted_count} receipt(s)", "deleted_count": deleted_count, "errors": errors if errors else None}

# ================= RUN APP =================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
