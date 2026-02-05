"""
OCR utilities using pytesseract
"""
import re
from datetime import datetime
from PIL import Image, ImageOps, ImageFilter
import pytesseract

# CRITICAL: Set Tesseract path for Render deployment
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"


def extract_receipt_data(image_path: str) -> dict:
    """
    Extract price, date, and time from receipt image using OCR
    Returns dict with extracted fields
    """
    try:
        # Open image and run OCR with preprocessing + multiple configs
        image = Image.open(image_path)
        text = run_ocr_with_fallbacks(image)
        
        # Extract price (look for currency symbols and numbers)
        price = extract_price(text)
        
        # Extract date
        date = extract_date(text)
        
        # Extract time
        time = extract_time(text)
        
        return {
            "ocr_price": price,
            "ocr_date": date,
            "ocr_time": time,
            "ocr_raw_text": text
        }
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"❌ OCR Error: {str(e)}")
        print(f"Full traceback: {error_details}")
        return {
            "ocr_price": None,
            "ocr_date": None,
            "ocr_time": None,
            "ocr_raw_text": f"OCR failed: {str(e)}"
        }


def extract_price(text: str) -> float:
    """Extract price from OCR text"""
    # Look for patterns like $123.45, 123.45, R123.45, etc.
    patterns = [
        r'(?:Grand\s*Total|Total\s*Due|Total|Amount\s*Due|Amount|Balance\s*Due)[:\s]*' 
        r'(?:USD|R|\$|EUR|£|₦|₵|K|KES|GHS|NGN|ZAR)?\s*(\d{1,3}(?:[\s,]\d{3})*(?:[\.,]\d{2})?)',
        r'(?:USD|R|\$|EUR|£|₦|₵|K|KES|GHS|NGN|ZAR)?\s*(\d{1,3}(?:[\s,]\d{3})*(?:[\.,]\d{2})?)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                price_str = match.group(1).replace(' ', '').replace(',', '')
                return float(price_str)
            except ValueError:
                continue
    
    return None


def extract_date(text: str) -> str:
    """Extract date from OCR text"""
    # Common date patterns
    patterns = [
        r'\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\b',  # 12/31/2023 or 31-12-2023
        r'\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b',    # 2023-12-31
        r'\b([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b',  # December 31, 2023
        r'\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})\b'     # 31 December 2023
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    
    return None


def extract_time(text: str) -> str:
    """Extract time from OCR text"""
    # Time patterns like 14:30, 2:30 PM, 14:30:45
    patterns = [
        r'\b(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\b'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1)
    
    return None


def run_ocr_with_fallbacks(image: Image.Image) -> str:
    """Run OCR with basic preprocessing and multiple tesseract configs."""
    # Preprocess: grayscale, increase contrast, sharpen
    gray = ImageOps.grayscale(image)
    enhanced = ImageOps.autocontrast(gray)
    sharpened = enhanced.filter(ImageFilter.SHARPEN)

    # Try several configs to improve recall
    configs = [
        "--oem 3 --psm 6",
        "--oem 3 --psm 4",
        "--oem 3 --psm 11",
    ]

    texts = []
    for cfg in configs:
        try:
            texts.append(pytesseract.image_to_string(sharpened, config=cfg))
        except Exception:
            continue

    # If no text extracted, fall back to raw image
    if not any(t.strip() for t in texts):
        try:
            return pytesseract.image_to_string(image)
        except Exception:
            return ""

    # Return the longest text (usually most complete)
    return max(texts, key=lambda t: len(t.strip()))
