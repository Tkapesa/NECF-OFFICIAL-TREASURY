# 🚨 CRITICAL: Render Root Directory Configuration

## Problem
If OCR is not working and build logs show "Tesseract not found", you may have the wrong Root Directory setting.

## Symptoms
- ❌ Root Directory set to: `backend/aptfile`
- ❌ Build logs: No mention of "Installing dependencies from aptfile"
- ❌ All OCR fields return NULL

## Solution

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Select your service: `necf-treasury-backend`
3. Click **Settings**

### Step 2: Fix Root Directory
Find the **Root Directory** field and verify it shows:

```
✅ CORRECT: backend
❌ WRONG:   backend/aptfile
❌ WRONG:   (empty)
❌ WRONG:   .
```

**How to Fix:**
1. Click "Edit" on the Root Directory field
2. Delete whatever is there
3. Type exactly: `backend`
4. Click "Save Changes"

### Step 3: Verify Deployment
After the service redeploys, check build logs for:

```log
==> Changing directory to backend/
==> Installing dependencies from aptfile
Reading package lists...
Installing tesseract-ocr
```

## Why This Matters

**Render's Build Process:**
```bash
# Step 1: Render changes to Root Directory
cd backend/                    # ← Set in dashboard

# Step 2: Render looks for aptfile HERE
ls aptfile                     # ← Must exist in current directory!

# Step 3: If found, install packages
apt-get install $(cat aptfile)
```

**If Root Directory is wrong:**
```bash
# WRONG: Root Directory = backend/aptfile
cd backend/aptfile/            # ❌ This is a FILE, not a directory!
# ERROR: Not a directory

# WRONG: Root Directory = (empty)
cd ./                          # ❌ Stays in repo root
ls aptfile                     # ❌ Not found (it's in backend/)
```

## File Structure
```
Repository:
├── backend/
│   ├── aptfile              ← Tesseract packages
│   ├── main.py
│   ├── requirements.txt
│   └── ...
└── render.yaml              ← rootDir: backend
```

## Verification Command

After deployment, test the debug endpoint:

```bash
curl https://necftreausry.com/api/debug/tesseract
```

**Expected Response:**
```json
{
  "tesseract_installed": true,
  "version": "tesseract 4.1.1",
  "path": "/usr/bin/tesseract"
}
```

---

## If You Need Help

1. Check build logs for "Installing dependencies from aptfile"
2. Visit: https://necftreausry.com/api/debug/tesseract
3. If still failing, screenshot your Render Settings page and share

**Remember:** This is a DASHBOARD configuration, not a code issue!
