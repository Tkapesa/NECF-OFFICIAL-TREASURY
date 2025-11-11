"""
Database models for Church Treasury System
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Admin(Base):
    """Admin user model for authentication"""
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Receipt(Base):
    """Receipt model storing user submission and OCR data"""
    __tablename__ = "receipts"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # User-submitted fields
    user_name = Column(String, nullable=False)
    user_phone = Column(String, nullable=False)
    item_bought = Column(String, nullable=False)
    approved_by = Column(String, nullable=False)
    
    # OCR extracted fields (editable by admin)
    ocr_price = Column(Float, nullable=True)
    ocr_date = Column(String, nullable=True)
    ocr_time = Column(String, nullable=True)
    ocr_raw_text = Column(Text, nullable=True)  # Full OCR text for reference
    
    # Receipt image path
    image_path = Column(String, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
