"""
FastAPI backend for Church Treasury System
"""
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
import shutil
import os
from typing import Optional

from database import get_db, init_db
from models import Receipt, Admin
from ocr_utils import extract_receipt_data

# JWT Configuration
class Settings(BaseModel):
    authjwt_secret_key: str = "your-secret-key-change-this-in-production-please"
    authjwt_token_location: set = {"headers"}
    authjwt_access_token_expires: int = 1440 * 60  # 24 hours in seconds

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

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Initialize FastAPI app
app = FastAPI(title="Church Treasury System")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:5174",  # Vite alternate port
        "http://localhost:5175",  # Vite alternate port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Create uploads folder if not exists
os.makedirs("uploads", exist_ok=True)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Create default admin (username: admin, password: admin123)
    db = next(get_db())
    if not db.query(Admin).filter(Admin.username == "admin").first():
        admin = Admin(
            username="admin",
            hashed_password=hash_password("admin123")
        )
        db.add(admin)
        db.commit()
        print("Default admin created: username=admin, password=admin123")


# ============ AUTH UTILITIES ============

def verify_password(plain_password, hashed_password):
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


# ============ API ROUTES ============

@app.get("/")
def root():
    """Health check"""
    return {"message": "Church Treasury System API", "status": "running"}


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
    
    # Create access token
    access_token = Authorize.create_access_token(subject=admin.username)
    print(f"✅ Login successful for user '{username}'")
    
    return {"access_token": access_token, "token_type": "bearer"}


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
    file_path = f"uploads/{filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    # Run OCR on the image
    ocr_data = extract_receipt_data(file_path)
    
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
    
    return {
        "message": "Receipt uploaded successfully",
        "receipt_id": receipt.id,
        "ocr_data": ocr_data
    }


@app.get("/api/receipts")
def get_receipts(db: Session = Depends(get_db), Authorize: AuthJWT = Depends()):
    """Admin endpoint to get all receipts"""
    
    # Verify admin token
    Authorize.jwt_required()
    
    receipts = db.query(Receipt).order_by(Receipt.created_at.desc()).all()
    
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
                "image_path": f"http://localhost:8000/{r.image_path}",
                "created_at": r.created_at.isoformat()
            }
            for r in receipts
        ]
    }


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
