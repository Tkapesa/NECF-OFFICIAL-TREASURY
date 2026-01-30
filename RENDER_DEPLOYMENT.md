# Render Deployment Guide for NECF Treasury System

This guide provides complete instructions for deploying the NECF Church Treasury System to Render with PostgreSQL (Neon) database support and Tesseract OCR functionality.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting Up Neon PostgreSQL Database](#setting-up-neon-postgresql-database)
3. [Deploying to Render](#deploying-to-render)
4. [Configuring Environment Variables](#configuring-environment-variables)
5. [Setting Up Persistent Storage](#setting-up-persistent-storage)
6. [Verifying Deployment](#verifying-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Cost Breakdown](#cost-breakdown)

---

## Prerequisites

Before you begin, ensure you have:

- A GitHub account with this repository
- A [Render account](https://render.com) (free tier available)
- A [Neon account](https://neon.tech) for PostgreSQL database (free tier available)

---

## Setting Up Neon PostgreSQL Database

### Step 1: Create a Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create a New Project

1. Click **"Create a project"**
2. Choose a project name (e.g., `necf-treasury`)
3. Select a region closest to your Render service (for best performance)
4. Click **"Create project"**

### Step 3: Get Database Connection String

1. After project creation, you'll see your connection details
2. Copy the **Connection String** (it looks like this):
   ```
   postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. Save this connection string - you'll need it for Render environment variables

### Step 4: (Optional) Create Database Tables

The application will automatically create tables on first run, but you can verify database connectivity:

1. Click on **"SQL Editor"** in Neon dashboard
2. Run a test query:
   ```sql
   SELECT version();
   ```
3. Ensure you see PostgreSQL version information

---

## Deploying to Render

### Option 1: Using render.yaml (Recommended - One-Click Deploy)

This repository includes a `render.yaml` file that automates the deployment process.

1. **Connect to GitHub**
   - Log in to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub account if not already connected
   - Select this repository: `Tkapesa/NECF-OFFICIAL-TREASURY`

2. **Configure Blueprint**
   - Render will detect the `render.yaml` file automatically
   - Review the service configuration
   - Click **"Apply"** to create the service

3. **The blueprint will create:**
   - A web service for the backend
   - A persistent disk for file uploads (1GB)
   - Environment variables (you'll need to set the values)

### Option 2: Manual Deployment

If you prefer manual setup:

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `necf-treasury-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add System Dependencies**
   - Render will automatically detect the `aptfile` in the backend directory
   - This installs Tesseract OCR and English language data

### Important: aptfile Location for Render

Render's buildpack system requires the `aptfile` to be in the **root directory** of the repository to properly install system dependencies like Tesseract OCR. 

- **Root `aptfile`**: Required by Render's buildpack to install system packages during build
- **Backend `aptfile`**: Kept for documentation purposes

The root `aptfile` contains:
```
tesseract-ocr
tesseract-ocr-eng
```

Without the root `aptfile`, Tesseract OCR will not be installed, causing OCR functionality to fail with empty `ocr_raw_text`, `ocr_price`, `ocr_date`, and `ocr_time` values in receipt uploads.

---

## Configuring Environment Variables

After creating the service, configure these environment variables in Render:

### Required Environment Variables

Navigate to **Service Settings** → **Environment** and add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DATABASE_URL` | Your Neon connection string | PostgreSQL database URL from Neon |
| `JWT_SECRET_KEY` | Generate secure key* | Secret key for JWT authentication |
| `DEFAULT_ADMIN_PASSWORD` | Your secure password | Initial admin password |
| `FRONTEND_URL` | Your frontend URL | URL where frontend is deployed |
| `CORS_ORIGINS` | Your frontend URL(s) | Comma-separated allowed origins |

**Generate a secure JWT_SECRET_KEY:**
```bash
openssl rand -hex 32
```
Or use Render's "Generate" button for this variable.

### Optional Environment Variables (with defaults)

| Variable Name | Default Value | Description |
|--------------|---------------|-------------|
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Token expiration (24 hours) |
| `BACKEND_HOST` | `0.0.0.0` | Backend host |
| `MAX_UPLOAD_SIZE` | `10485760` | Max upload size (10MB) |
| `UPLOAD_DIR` | `/var/data/uploads` | Upload directory path |
| `DEFAULT_ADMIN_USERNAME` | `admin` | Initial admin username |
| `LOG_LEVEL` | `INFO` | Logging level |

### Example Configuration

```env
DATABASE_URL=postgresql://user:pass@ep-xxxxx.region.aws.neon.tech/necf_treasury?sslmode=require
JWT_SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440
BACKEND_HOST=0.0.0.0
FRONTEND_URL=https://necf-treasury-frontend.onrender.com
CORS_ORIGINS=https://necf-treasury-frontend.onrender.com,https://www.necftreausry.com
MAX_UPLOAD_SIZE=10485760
UPLOAD_DIR=/var/data/uploads
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=YourSecurePassword123!
LOG_LEVEL=INFO
```

---

## Setting Up Persistent Storage

Receipt images need persistent storage that survives deployments.

### Step 1: Add Render Disk

1. Go to your service in Render Dashboard
2. Navigate to **"Disks"** tab
3. Click **"Add Disk"**
4. Configure:
   - **Name**: `necf-treasury-uploads`
   - **Mount Path**: `/var/data`
   - **Size**: `1 GB` (increase if needed)
5. Click **"Create"**

### Step 2: Update UPLOAD_DIR Environment Variable

Ensure `UPLOAD_DIR=/var/data/uploads` is set in environment variables.

### Important Notes

- The application will create the `uploads` subdirectory automatically
- Files persist across deployments
- Increase disk size if you expect many receipt uploads
- Disk pricing: $0.25/GB/month

---

## Verifying Deployment

### Step 1: Check Service Status

1. Go to Render Dashboard
2. Check your service status - should show "Live" (green)
3. Click on the service to see logs

### Step 2: Test API Endpoints

Get your service URL from Render (e.g., `https://necf-treasury-backend.onrender.com`)

**Health Check:**
```bash
curl https://your-service-url.onrender.com/
```

Expected response:
```json
{
  "status": "ok",
  "message": "NECF Treasury API"
}
```

**Test Receipt Upload:**
```bash
curl -X POST https://your-service-url.onrender.com/receipts/upload \
  -F "image=@path/to/receipt.jpg" \
  -F "user_name=Test User" \
  -F "user_phone=1234567890" \
  -F "item_bought=Test Item" \
  -F "approved_by=Admin"
```

Expected response with `ocr_price`, `ocr_date`, `ocr_time` fields.

**Test Admin Login:**
```bash
curl -X POST https://your-service-url.onrender.com/login \
  -F "username=admin" \
  -F "password=YourSecurePassword123!"
```

**Note**: Replace `your-service-url.onrender.com` with your actual Render service URL.

Expected response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Step 3: Verify Tesseract OCR

1. Upload a clear receipt image with visible price, date, and time
2. Check the response for populated OCR fields
3. If OCR fields are empty or null:
   - Check service logs for Tesseract errors
   - Verify `aptfile` was processed during build
   - Ensure receipt image is clear and readable

### Step 4: Check Database Connection

1. In Render logs, verify no database connection errors
2. Upload a receipt and verify it's stored in database
3. Use Neon dashboard to query the database:
   ```sql
   SELECT * FROM receipts LIMIT 10;
   ```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. OCR Fields Empty or Null

**Problem**: Uploaded receipts don't extract price, date, or time.

**Solutions**:
- Verify Tesseract installation in logs:
  ```
  Looking for "tesseract --version" in build logs
  ```
- Check `aptfile` exists in `backend/` directory
- Try re-deploying: **Manual Deploy** → **Clear build cache & deploy**
- Ensure image is clear, flat, and well-lit

#### 2. Database Connection Errors

**Problem**: Logs show `connection refused` or `authentication failed`

**Solutions**:
- Verify `DATABASE_URL` is correctly set
- Check Neon database is running (not paused)
- Ensure connection string includes `?sslmode=require`
- Test connection from Neon SQL Editor

#### 3. CORS Errors in Frontend

**Problem**: Frontend can't connect to API

**Solutions**:
- Add frontend URL to `CORS_ORIGINS`
- Include both `http://` and `https://` versions if needed
- Don't add trailing slashes to URLs
- Separate multiple origins with commas (no spaces)

#### 4. File Upload Fails

**Problem**: Receipts fail to upload or images not accessible

**Solutions**:
- Verify Render Disk is attached
- Check `UPLOAD_DIR` matches disk mount path + `/uploads`
- Ensure disk has available space
- Check service logs for permission errors

#### 5. Build Fails

**Problem**: Deployment fails during build

**Solutions**:
- Check `requirements.txt` has all dependencies
- Verify Python version compatibility
- Review build logs for specific error
- Try: **Manual Deploy** → **Clear build cache & deploy**

#### 6. Service Crashes on Start

**Problem**: Service deploys but immediately crashes

**Solutions**:
- Check for missing required environment variables
- Verify `DATABASE_URL` is valid
- Review service logs for error messages
- Ensure `START_COMMAND` is correct

### Getting Help

If you encounter issues not covered here:

1. Check Render service logs (real-time)
2. Check Neon database logs
3. Review [Render Documentation](https://render.com/docs)
4. Review [Neon Documentation](https://neon.tech/docs)
5. Contact support or open an issue on GitHub

---

## Cost Breakdown

### Render Costs (as of January 2026)

**Note**: Pricing is subject to change. Please verify current pricing at [render.com/pricing](https://render.com/pricing) before deployment.

**Free Tier**:
- 750 hours/month of free service time
- Services spin down after 15 min of inactivity
- 0.1 CPU, 512 MB RAM
- Slower build times

**Starter Plan ($7/month per service)**:
- Always-on service (no spin down)
- 0.5 CPU, 512 MB RAM
- Faster builds
- Custom domains included

**Persistent Disk**:
- $0.25/GB/month
- 1 GB recommended for receipts = $0.25/month

### Neon PostgreSQL Costs

**Free Tier**:
- 0.5 GB storage
- 1 database
- Compute: 0.25 vCPU
- Auto-pauses after 5 min inactivity
- Great for development/testing

**Scale Plan ($19/month)**:
- 10 GB storage included
- Additional storage: $3.50/GB/month
- Compute: configurable
- No auto-pause
- Multiple databases

### Total Monthly Cost Estimates

**Development/Small Church (Free Tier)**:
- Render: $0 (free tier, spins down when inactive)
- Neon: $0 (free tier)
- Disk: $0.25
- **Total: $0.25/month**

**Production/Active Church (Paid Tier)**:
- Render: $7 (starter plan, always-on)
- Neon: $0 (free tier) or $19 (scale plan)
- Disk: $0.25-$1 (1-4 GB)
- **Total: $7.25/month or $27.25/month**

### Cost Optimization Tips

1. **Use Free Tier for Testing**: Test thoroughly on free tier before upgrading
2. **Monitor Disk Usage**: Start with 1 GB disk, scale up only if needed
3. **Neon Auto-pause**: Free tier auto-pauses when inactive, saving on compute
4. **Image Optimization**: Compress receipt images before upload to reduce storage
5. **Scheduled Cleanup**: Implement periodic cleanup of old receipts if needed

---

## Next Steps

After successful deployment:

1. **Deploy Frontend**: Deploy the frontend to Render or Vercel
2. **Custom Domain**: Configure custom domain in Render settings
3. **SSL Certificate**: Render provides free SSL automatically
4. **Monitoring**: Set up alerts in Render for service health
5. **Backups**: Configure Neon database backups
6. **Admin Account**: Change default admin password immediately
7. **Testing**: Thoroughly test all functionality in production

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Tesseract OCR Documentation](https://tesseract-ocr.github.io/)
- [PostgreSQL with SQLAlchemy](https://docs.sqlalchemy.org/en/14/dialects/postgresql.html)

---

## Security Best Practices

1. **JWT Secret**: Use a strong, randomly generated secret
2. **Admin Password**: Change default password immediately
3. **Environment Variables**: Never commit secrets to repository
4. **Database**: Always use `sslmode=require` for Neon connections
5. **CORS**: Only allow specific trusted frontend origins
6. **Updates**: Keep dependencies updated regularly

---

**Need help?** Open an issue on GitHub or contact the development team.
