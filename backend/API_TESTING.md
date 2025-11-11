# API Testing Guide
# Church Treasury System Backend

## Base URL
```
http://localhost:8000
```

## 1. Health Check

**GET /**
```bash
curl http://localhost:8000/
```

Response:
```json
{
  "message": "Church Treasury System API",
  "status": "running"
}
```

---

## 2. Admin Login

**POST /api/login**

```bash
curl -X POST http://localhost:8000/api/login \
  -F "username=admin" \
  -F "password=admin123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

Save the `access_token` for subsequent requests.

---

## 3. Upload Receipt (User Side)

**POST /api/receipts/upload**

```bash
curl -X POST http://localhost:8000/api/receipts/upload \
  -F "image=@/path/to/receipt.jpg" \
  -F "user_name=John Doe" \
  -F "user_phone=+1234567890" \
  -F "item_bought=Office Supplies" \
  -F "approved_by=Pastor Smith"
```

Response:
```json
{
  "message": "Receipt uploaded successfully",
  "receipt_id": 1,
  "ocr_data": {
    "ocr_price": 45.99,
    "ocr_date": "2025-11-09",
    "ocr_time": "14:30",
    "ocr_raw_text": "STORE NAME\n..."
  }
}
```

---

## 4. Get All Receipts (Admin Only)

**GET /api/receipts**

Method 1 - Authorization Header (Recommended):
```bash
curl http://localhost:8000/api/receipts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Method 2 - Query Parameter:
```bash
curl "http://localhost:8000/api/receipts?token=YOUR_TOKEN_HERE"
```

Response:
```json
{
  "receipts": [
    {
      "id": 1,
      "user_name": "John Doe",
      "user_phone": "+1234567890",
      "item_bought": "Office Supplies",
      "approved_by": "Pastor Smith",
      "ocr_price": 45.99,
      "ocr_date": "2025-11-09",
      "ocr_time": "14:30",
      "ocr_raw_text": "STORE NAME\n...",
      "image_path": "http://localhost:8000/uploads/20251109_143000_receipt.jpg",
      "created_at": "2025-11-09T14:30:00"
    }
  ]
}
```

---

## 5. Update Receipt OCR Fields (Admin Only)

**PUT /api/receipts/{receipt_id}**

```bash
curl -X PUT http://localhost:8000/api/receipts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "ocr_price": 50.00,
    "ocr_date": "2025-11-09",
    "ocr_time": "15:00"
  }'
```

Note: All fields are optional. Only include the fields you want to update.

Response:
```json
{
  "message": "Receipt updated successfully"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Receipt not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Only image files allowed"
}
```

---

## Testing with Postman

### Setup
1. Create a new Collection: "Church Treasury API"
2. Add environment variable `base_url` = `http://localhost:8000`
3. Add environment variable `token` = (will be set after login)

### Login Request
- Method: POST
- URL: `{{base_url}}/api/login`
- Body: form-data
  - username: admin
  - password: admin123
- Tests (Auto-save token):
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.access_token);
}
```

### Protected Requests
Add to Headers:
- Key: `Authorization`
- Value: `Bearer {{token}}`

---

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Login
response = requests.post(f"{BASE_URL}/api/login", data={
    "username": "admin",
    "password": "admin123"
})
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get all receipts
response = requests.get(f"{BASE_URL}/api/receipts", headers=headers)
print(response.json())

# Upload receipt
files = {"image": open("receipt.jpg", "rb")}
data = {
    "user_name": "John Doe",
    "user_phone": "+1234567890",
    "item_bought": "Office Supplies",
    "approved_by": "Pastor Smith"
}
response = requests.post(f"{BASE_URL}/api/receipts/upload", files=files, data=data)
print(response.json())

# Update receipt
response = requests.put(
    f"{BASE_URL}/api/receipts/1",
    headers=headers,
    json={"ocr_price": 50.00}
)
print(response.json())
```

---

## Common Issues

### CORS Error
- Ensure frontend is running on `http://localhost:5173`
- Check CORS settings in `main.py`

### Token Expired
- Tokens expire after 24 hours
- Login again to get a new token

### OCR Not Working
- Ensure Tesseract is installed and in PATH
- Check image quality and format
- Review `ocr_utils.py` regex patterns

### File Upload Failed
- Check file size (if limit is set)
- Verify file is an image type
- Ensure `uploads/` directory exists and is writable
