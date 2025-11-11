"""
OCR utilities using pytesseract
"""
import re
from datetime import datetime
from PIL import Image
import pytesseract


def extract_receipt_data(image_path: str) -> dict:
    """
    Extract price, date, and time from receipt image using OCR
    Returns dict with extracted fields
    """
    try:
        # Open image and run OCR
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        
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
        print(f"OCR Error: {str(e)}")
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
        r'(?:USD|R|\$|EUR|£)?\s*(\d+[,.]?\d*\.?\d+)',
        r'Total[:\s]+(?:USD|R|\$|EUR|£)?\s*(\d+[,.]?\d*\.?\d+)',
        r'Amount[:\s]+(?:USD|R|\$|EUR|£)?\s*(\d+[,.]?\d*\.?\d+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                price_str = match.group(1).replace(',', '')
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
        r'\b([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b'  # December 31, 2023
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
