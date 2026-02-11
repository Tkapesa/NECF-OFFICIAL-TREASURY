# Deployment Troubleshooting Guide

## Issue: "Failed to Fetch Admin" or Dashboard Not Showing Data

### Symptoms:
- ✅ Backend is running
- ✅ Can upload receipts
- ❌ Dashboard shows no data
- ❌ Login fails or shows "failed to fetch admin"

### Root Cause: CORS or Database Connection

### Solution:

#### Step 1: Check Startup Logs

Go to Render Dashboard → Logs, look for:

```log
🚀 NECF Treasury Backend Starting Up...
✅ All required environment variables are set
✅ Using Neon PostgreSQL database
✅ Database tables initialized successfully
✅ Admin user exists: admin
✅ Allowing requests from: https://necftreausry.com
✅ Startup complete! Backend is ready.
```

**If you see ❌ or ⚠️ warnings**, fix those issues first!

#### Step 2: Test Health Endpoint

```bash
curl https://necf-treasury-backend.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "tables": {
    "admins": 1,
    "receipts": 10
  }
}
```

#### Step 3: Verify CORS Configuration

In Render Settings → Environment Variables:

```
CORS_ORIGINS = https://necftreausry.com,https://www.necftreausry.com
```

**Must include your frontend URL!**

#### Step 4: Test Backend Directly

```bash
# Login
curl -X POST https://necf-treasury-backend.onrender.com/api/login \
  -F "username=admin" \
  -F "password=YOUR_PASSWORD"

# Get receipts (use token from login)
curl https://necf-treasury-backend.onrender.com/api/receipts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

If this works but dashboard doesn't, it's a **CORS issue**.

---

## Issue: Database Tables Not Created

### Check Neon Database

1. Go to https://console.neon.tech
2. Open SQL Editor
3. Run:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected tables:**
- `admins`
- `receipts`

**If missing**, the startup event should create them automatically on next deploy.

**Force recreation:**
1. Render Dashboard → Manual Deploy
2. Clear build cache & deploy
3. Check logs for "Database tables initialized successfully"

---

## Issue: Environment Variables Not Set

### Symptoms:
- Logs show "Missing required environment variables"
- Login fails with authentication errors
- Database connection errors

### Solution:

Check Render Environment Variables:

```bash
# Required variables:
DATABASE_URL         # From Neon PostgreSQL
JWT_SECRET_KEY       # Random secure string
DEFAULT_ADMIN_PASSWORD  # Secure password
CORS_ORIGINS        # Frontend URL(s)
```

**Generate JWT_SECRET_KEY:**
```bash
openssl rand -hex 32
```

Or use Render's "Generate" button.

---

## Issue: CORS Errors in Browser Console

### Symptoms:
```
Access to fetch at 'https://backend.onrender.com/api/receipts' from origin 
'https://frontend.com' has been blocked by CORS policy
```

### Solution:

1. **Add Frontend URL to CORS_ORIGINS:**
   ```
   CORS_ORIGINS=https://your-frontend-url.com
   ```

2. **Multiple domains (comma-separated):**
   ```
   CORS_ORIGINS=https://necftreausry.com,https://www.necftreausry.com
   ```

3. **Development (allow all - not for production):**
   ```
   CORS_ORIGINS=*
   ```

4. **After updating**, redeploy the service for changes to take effect.

---

## Issue: Admin User Not Created

### Symptoms:
- Login fails with "Invalid credentials"
- Logs show "DEFAULT_ADMIN_PASSWORD not set"

### Solution:

1. **Set DEFAULT_ADMIN_PASSWORD in Render:**
   ```
   DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
   ```

2. **Redeploy the service**

3. **Check startup logs for:**
   ```
   ✅ Created default admin user: admin
   ```

4. **Test login:**
   ```bash
   curl -X POST https://your-backend.onrender.com/api/login \
     -F "username=admin" \
     -F "password=YourSecurePassword123!"
   ```

---

## Issue: Database Connection Errors

### Symptoms:
```
❌ ERROR: Failed to initialize database
sqlalchemy.exc.OperationalError: could not connect to server
```

### Solution:

1. **Verify DATABASE_URL format:**
   ```
   postgresql://username:password@host.neon.tech/database?sslmode=require
   ```

2. **Check Neon database status:**
   - Go to https://console.neon.tech
   - Ensure database is not paused (free tier auto-pauses)
   - Check compute status

3. **Test connection from Neon SQL Editor:**
   ```sql
   SELECT version();
   ```

4. **Use Pooled Connection string** (recommended):
   - In Neon dashboard, copy "Pooled connection" not "Direct connection"

---

## Issue: File Uploads Failing

### Symptoms:
- Upload returns 500 error
- Images not appearing after upload
- Logs show "Permission denied" or "Directory not found"

### Solution:

1. **Check Render Disk is attached:**
   - Go to Service → Disks
   - Ensure disk is mounted at `/var/data`

2. **Verify UPLOAD_DIR environment variable:**
   ```
   UPLOAD_DIR=/var/data/uploads
   ```

3. **Check disk space:**
   - Monitor disk usage in Render dashboard
   - Increase size if needed

---

## Issue: OCR Not Extracting Data

### Symptoms:
- Receipt uploads succeed
- But `ocr_price`, `ocr_date`, `ocr_time` are empty or null

### Solution:

1. **Verify Tesseract is installed:**
   - Check build logs for "tesseract --version"
   - Ensure `aptfile` exists in repository root

2. **Test OCR endpoint:**
   ```bash
   curl https://your-backend.onrender.com/api/debug/tesseract
   ```

3. **If Tesseract missing:**
   - Ensure `aptfile` is in repository root (not just backend/)
   - Contents should be:
     ```
     tesseract-ocr
     tesseract-ocr-eng
     ```
   - Redeploy with "Clear build cache & deploy"

---

## Quick Diagnostic Checklist

Run these checks in order:

- [ ] **Health check:** `curl https://your-backend.onrender.com/api/health`
- [ ] **Startup logs:** Check for ✅ green checkmarks
- [ ] **Environment variables:** All required vars set in Render
- [ ] **Database connection:** Neon database is active (not paused)
- [ ] **CORS origins:** Frontend URL is in CORS_ORIGINS
- [ ] **Admin user:** DEFAULT_ADMIN_PASSWORD is set
- [ ] **Disk mounted:** /var/data disk attached (if using file uploads)

---

## Getting Help

If issues persist:

1. **Review startup logs** for specific error messages
2. **Check browser console** for CORS or network errors
3. **Test API directly** using curl commands above
4. **Verify Neon database** using SQL Editor
5. **Open GitHub issue** with logs and error messages

---

## Common Render Service States

| State | Meaning | Action |
|-------|---------|--------|
| 🟢 Live | Service running | Everything OK |
| 🟡 Building | Deploying update | Wait for completion |
| 🔴 Build Failed | Build error | Check build logs |
| 🔴 Deploy Failed | Runtime error | Check service logs |
| ⚪ Suspended | Manually stopped | Resume service |

---

## Useful Commands

**Check all environment variables are set:**
```bash
# In Render Shell (Service → Shell)
env | grep -E "DATABASE_URL|JWT_SECRET|ADMIN_PASSWORD|CORS"
```

**Test database connection:**
```bash
# In Render Shell
python -c "from database import engine; print(engine.url)"
```

**View recent logs:**
```bash
# Render Dashboard → Logs (live tail)
# Or download logs for offline analysis
```

---

**Need more help?** Contact support or open an issue with:
- Startup logs
- Environment variable configuration (hide sensitive values)
- Error messages from browser console
- Steps to reproduce the issue
