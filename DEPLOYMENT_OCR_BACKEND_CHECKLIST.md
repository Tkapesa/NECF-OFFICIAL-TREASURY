# OCR + Backend Deployment Checklist (necftreausry.com)

This checklist ensures OCR and backend are correctly deployed for https://necftreausry.com.

## Step-by-step for Mitchel (hosting only)
Follow these steps in order. Skipping any step can break OCR or stop receipts from showing.

1) Confirm backend is running
- Backend service must be active (systemd/pm2/docker/etc.).
- Verify health:
  - `curl https://necftreausry.com/api`

2) Install OCR engine (critical)
- Ensure Tesseract is installed on the server (see Section 2 below).
- Verify: `tesseract --version`

3) Preserve database + uploads (critical)
- Do NOT overwrite:
  - `backend/treasury.db`
  - `backend/uploads/`
- Ensure the backend user can write to both paths.

4) Confirm reverse proxy routing
- `/api` must route to the backend service.
- Static files must serve the frontend build.

5) Verify live behavior
- Open https://necftreausry.com
- Upload a receipt.
- Login to admin and confirm receipts appear.

If any step fails, stop and fix before moving on.

## 1) Backend build + deploy
- Pull latest code from main branch.
- Install backend dependencies:
  - Use backend/requirements.txt
- Start the backend service and verify it is reachable at:
  - https://necftreausry.com/api

## 2) OCR dependencies (Tesseract)
OCR uses pytesseract. The host must have Tesseract installed.

**Verify Tesseract is installed**
- `tesseract --version`

If missing, install for your server OS:
- Ubuntu/Debian: `sudo apt-get update && sudo apt-get install -y tesseract-ocr`
- CentOS/RHEL: `sudo yum install -y tesseract`
- macOS: `brew install tesseract`

**Verify Python OCR libraries**
- `pip show pytesseract`
- `pip show pillow`

## 3) Backend environment + database
- Database file must persist on the server:
  - backend/treasury.db
- Ensure backend service has write permissions for:
  - backend/uploads/
  - backend/treasury.db

## 4) CORS + domain check
Backend CORS must allow:
- https://necftreausry.com
- https://www.necftreausry.com

Verify in backend/main.py:
- `allow_origins` contains the above

## 5) Frontend configuration
- Production API URL must be:
  - `VITE_API_URL=https://necftreausry.com/api`
- Verify in frontend/.env.production

Build the frontend with production env:
- `npm install`
- `npm run build`

Deploy the frontend build output:
- frontend/dist

## 6) API verification (post-deploy)
Run these checks after deployment:

- Health check:
  - `curl https://necftreausry.com/api`

- Upload receipt (expect 200 OK):
  - `curl -X POST https://necftreausry.com/api/receipts/upload \
      -F "image=@/path/to/receipt.jpg" \
      -F "user_name=Test User" \
      -F "user_phone=1234567890" \
      -F "item_bought=Test Item" \
      -F "approved_by=Admin"`

- Login (expect 200 OK):
  - `curl -X POST https://necftreausry.com/api/login \
      -F "username=admin" \
      -F "password=admin123"`

- Receipts list (requires token):
  - `curl -H "Authorization: Bearer <TOKEN>" https://necftreausry.com/api/receipts`

## 7) OCR verification
- Upload a clear receipt image.
- Confirm the response includes:
  - `ocr_price`
  - `ocr_date`
  - `ocr_time`
- If OCR is empty:
  - Verify Tesseract installation
  - Ensure images are readable (clear, flat, good lighting)

## 8) Troubleshooting
- **OCR fields empty**:
  - Tesseract missing or not in PATH
  - Image too blurry or low contrast
- **Upload fails**:
  - Check /api/receipts/upload response
  - Check server logs for 4xx/5xx
- **Dashboard shows no receipts**:
  - Confirm /api/receipts returns data with a valid token
  - Confirm Authorization header is sent

---
If you want this checklist tailored to your hosting provider (NGINX, Docker, PM2, etc.), share the setup details.
