# 🚀 NECF Treasury - Render Deployment Guide

This guide walks you through deploying the NECF Treasury application on **Render** using **Docker** with **Neon PostgreSQL** as the persistent database.

## 📋 Prerequisites

Before you begin, you'll need:

1. **GitHub Account** - Your repository must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **Neon Account** - Sign up at [neon.tech](https://neon.tech) (free tier available)

---

## 🗄️ Step 1: Set Up Neon PostgreSQL Database

### 1.1 Create a Neon Database

1. Go to [neon.tech](https://neon.tech) and sign in
2. Click **"Create Project"**
3. Configure your project:
   - **Project Name**: `necf-treasury-db` (or any name you prefer)
   - **Region**: Choose a region close to your Render service (e.g., US East for best performance)
   - **PostgreSQL Version**: 15 or later (recommended)
4. Click **"Create Project"**

### 1.2 Get Your Database Connection String

1. In your Neon project dashboard, click on **"Connection Details"**
2. **IMPORTANT**: Select **"Pooled connection"** (not Direct connection)
   - The pooled connection URL ends with `-pooler`
   - Example: `ep-rough-sea-ahz2rlqy-pooler.us-east-1.aws.neon.tech`
3. Copy the **full connection string**. It should look like:
   ```
   postgresql://neondb_owner:npg_xxxxx@ep-xxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```
4. **Add the required parameters** to the connection string:
   ```
   postgresql://neondb_owner:npg_xxxxx@ep-xxxxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
   ⚠️ Notice the `&channel_binding=require` at the end

### 1.3 Important Notes About Database

- ✅ **Use the POOLED connection** (ends with `-pooler`) for Render
- ✅ **Include both** `sslmode=require` **and** `channel_binding=require` parameters
- ✅ Neon free tier provides 512 MB storage (sufficient for most applications)
- ✅ Your database credentials are shown only once - save them securely!

---

## 🐳 Step 2: Deploy to Render

### Option A: Deploy Using render.yaml (Recommended)

This repository includes a `render.yaml` blueprint for easy deployment.

1. **Connect Your Repository**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

2. **Configure Environment Variables**
   - Render will show all environment variables defined in `render.yaml`
   - **Required: Set the DATABASE_URL**:
     - Click on `DATABASE_URL`
     - Paste your Neon PostgreSQL connection string (with `channel_binding=require`)
   - **Required: Set CORS_ORIGINS**:
     - For production: Use your domain(s), e.g., `https://yourdomain.com`
     - For testing only: Use `*` to allow all origins
   - **Optional: View DEFAULT_ADMIN_PASSWORD**:
     - Auto-generated secure password (save this!)
     - Or set your own strong password
   - Other variables are pre-configured:
     - `JWT_SECRET_KEY`: Auto-generated secure key ✅
     - `PORT`: 8000 ✅
     - `SERVE_FRONTEND`: 1 ✅
     - `DEFAULT_ADMIN_USERNAME`: admin

3. **Deploy**
   - Click **"Apply"**
   - Render will start building your Docker image
   - This may take 5-10 minutes for the first build

### Option B: Manual Deployment

If you prefer manual setup:

1. **Create a New Web Service**
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `necf-treasury` (or any name)
   - **Region**: Choose same region as your Neon database
   - **Branch**: `main` or your deployment branch
   - **Runtime**: Docker
   - **Plan**: Free (or higher for production)

3. **Add Environment Variables**
   Click **"Advanced"** → **"Add Environment Variable"** and add:
   
   | Key | Value | Notes |
   |-----|-------|-------|
   | `DATABASE_URL` | Your Neon connection string | **Required** - Include `channel_binding=require` |
   | `JWT_SECRET_KEY` | Generate using: `openssl rand -hex 32` | **Required** - Use a strong random key |
   | `PORT` | `8000` | Required for Render |
   | `SERVE_FRONTEND` | `1` | Required to serve React frontend |
   | `CORS_ORIGINS` | `https://yourdomain.com` | **Production**: Use your domain(s). **Testing only**: `*` |
   | `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | 24 hours |
   | `DEFAULT_ADMIN_USERNAME` | `admin` | Optional - default admin username |
   | `DEFAULT_ADMIN_PASSWORD` | Strong password | **Required** - Use a secure password, not admin123! |

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will build and deploy your application

---

## ✅ Step 3: Verify Deployment

### 3.1 Check Build Logs

1. Go to your service in Render dashboard
2. Click on **"Logs"** tab
3. Wait for the build to complete (look for "Live" status)
4. Verify there are no errors

### 3.2 Test the Application

1. Once deployed, Render provides a URL like: `https://necf-treasury.onrender.com`
2. Visit the URL in your browser
3. You should see the NECF Treasury login page
4. Try logging in with the admin credentials you set:
   - **Username**: Value from `DEFAULT_ADMIN_USERNAME` (default: `admin`)
   - **Password**: Value from `DEFAULT_ADMIN_PASSWORD` (check Render dashboard if auto-generated)

### 3.3 Verify Database Connection

1. After logging in, try uploading a receipt
2. The receipt should be saved to your Neon PostgreSQL database
3. Check your Neon dashboard to see the data

---

## 🔒 Step 4: Security Configuration (Production)

### 4.1 Change Default Admin Password

⚠️ **IMPORTANT**: If you used a weak or default password, change it immediately!

1. Log in to your application
2. Go to Admin Management (if you're a superuser)
3. Create a new admin with a strong password
4. Delete or change the default admin account

### 4.2 Update JWT Secret Key

The JWT secret key should be a strong, random value:

```bash
# Generate a secure key
openssl rand -hex 32
```

Update the `JWT_SECRET_KEY` environment variable in Render dashboard.

### 4.3 Configure CORS Origins

For production, restrict CORS to your specific domain(s):

```env
# Instead of "*", use your domain(s)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Update the `CORS_ORIGINS` environment variable in Render dashboard.

### 4.4 Strong Password Policy

The application enforces strong passwords for new admins:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

---

## 🔄 Step 5: Continuous Deployment

### Auto-Deploy on Git Push

Render automatically redeploys your application when you push to your connected branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. Render automatically detects the push and redeploys

### Manual Deploy

You can also trigger a manual deploy from Render dashboard:

1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 📊 Step 6: Monitoring and Logs

### View Application Logs

1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs of your application

### Check Service Status

1. Go to your service dashboard
2. Check the **"Status"** indicator (should be "Live")
3. View metrics like CPU, memory usage

### Database Monitoring

1. Go to your Neon dashboard
2. Click on your project
3. View database metrics, queries, and connections

---

## 🐛 Troubleshooting

### Build Fails

**Problem**: Docker build fails during deployment

**Solutions**:
- Check **Logs** tab in Render dashboard for error messages
- Ensure `Dockerfile` is in repository root
- Verify `requirements.txt` has all dependencies
- Check that `frontend/package.json` exists

### Database Connection Errors

**Problem**: Application can't connect to Neon database

**Solutions**:
- Verify `DATABASE_URL` is correct and includes `channel_binding=require`
- Ensure you're using the **POOLED connection** URL (ends with `-pooler`)
- Check that `sslmode=require` is in the connection string
- Verify your Neon project is active (not suspended)

### Application Crashes on Startup

**Problem**: Service shows as "Failed" or keeps restarting

**Solutions**:
- Check Render logs for error messages
- Verify all required environment variables are set
- Ensure `PORT` environment variable is set to `8000`
- Check that `SERVE_FRONTEND=1` is set

### Frontend Not Loading

**Problem**: API works but frontend doesn't load

**Solutions**:
- Verify `SERVE_FRONTEND=1` environment variable is set
- Check that frontend was built during Docker build (see logs)
- Ensure `FRONTEND_DIST=/app/frontend/dist` is correct

### CORS Errors

**Problem**: Browser shows CORS errors when accessing API

**Solutions**:
- Update `CORS_ORIGINS` to include your frontend domain
- For development, use `CORS_ORIGINS=*`
- For production, use specific domain: `CORS_ORIGINS=https://yourdomain.com`

---

## 📚 Additional Resources

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `JWT_SECRET_KEY` | ✅ Yes | - | Secret key for JWT tokens |
| `PORT` | ✅ Yes | `8000` | Server port (Render requirement) |
| `SERVE_FRONTEND` | ✅ Yes | `1` | Serve React frontend from backend |
| `CORS_ORIGINS` | No | `*` | Comma-separated list of allowed origins |
| `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` | No | `1440` | JWT token expiration (minutes) |
| `DEFAULT_ADMIN_USERNAME` | No | `admin` | Default admin username |
| `DEFAULT_ADMIN_PASSWORD` | No | `admin123` | Default admin password |

### Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Render Service │
│  (Docker)       │
│                 │
│  ┌───────────┐  │
│  │  Frontend │  │ (React - Static files)
│  │  (Port 80)│  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │  Backend  │  │ (FastAPI - Port 8000)
│  │  (uvicorn)│  │
│  └─────┬─────┘  │
└────────┼────────┘
         │ PostgreSQL
         ▼
┌─────────────────┐
│  Neon Database  │
│  (PostgreSQL)   │
└─────────────────┘
```

### Useful Commands

Generate a secure JWT secret:
```bash
openssl rand -hex 32
```

Test database connection locally:
```bash
psql "postgresql://user:pass@host/db?sslmode=require&channel_binding=require"
```

Build Docker image locally:
```bash
docker build -t necf-treasury .
```

Run Docker container locally:
```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET_KEY="your-secret-key" \
  -e SERVE_FRONTEND=1 \
  necf-treasury
```

---

## 🎉 Success!

Your NECF Treasury application is now deployed on Render with Neon PostgreSQL! 

**Important Post-Deployment Steps**:
1. ✅ Change default admin password
2. ✅ Update JWT secret key
3. ✅ Configure CORS for production
4. ✅ Test all features (login, upload, view receipts)
5. ✅ Set up monitoring and alerts

For support or issues, please open an issue on GitHub.

---

## 📝 Notes

### Data Persistence

- ✅ **Database**: All data is stored in Neon PostgreSQL (persistent)
- ⚠️ **Uploaded Files**: Stored in container filesystem (ephemeral)
  - When Render restarts your container, uploaded files are lost
  - For production, consider using cloud storage (S3, Cloudinary, etc.)

### Render Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of runtime (sufficient for most applications)
- Consider upgrading for production use

### Neon Free Tier Limitations

- 512 MB storage
- 1 project
- 10 branches
- Compute time limitations
- Consider upgrading for production use

---

**Last Updated**: 2024-02-11
**Version**: 1.0.0
