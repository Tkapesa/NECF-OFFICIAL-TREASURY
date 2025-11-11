# How to View OCR Extracted Text

## 🎯 Quick Test Guide

Your system is ready! Here's how to see the OCR text:

### Step 1: Open the App
1. Open your browser
2. Go to: **http://localhost:5173**

### Step 2: Login to Admin Dashboard
1. Click **"Admin Dashboard"** or **"Login"**
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click **"Login"**

### Step 3: View OCR Text

#### 🖥️ On Desktop:
1. You'll see a table with 4 receipts
2. Look for the **down arrow** (⬇️) button on the left side of each row
3. Click the arrow to **expand** the receipt
4. Scroll down in the expanded section
5. You'll see a new section: **"📝 OCR Extracted Text"**
6. The OCR text will be displayed in a gray box with a dashed border

#### 📱 On Mobile:
1. You'll see receipt cards
2. Tap **"Show More"** at the bottom of any receipt card
3. Scroll down in the expanded details
4. You'll see: **"📝 OCR Extracted Text"**
5. The text is in a scrollable gray box

### What You'll See:

**Receipt #1, #2, #3** (uploaded before Tesseract was installed):
```
OCR failed: tesseract is not installed or it's not in your PATH...
```

**Receipt #4** (uploaded with working OCR):
```
er Dileriz.
tKAS SOE ERE TD
AST TECHNOL LTD.
ve cry Taskinkdulletisintak.
Kmulesiond LEFKOSA Tel 105...
```
This is the actual text extracted from the receipt image! ✅

## 🎨 Visual Features:
- Light gray background (#f8f9fa)
- Dashed border
- Monospace font (code-style)
- Scrollable if text is long
- Preserves original line breaks and spacing

## 📸 Screenshot Location:
Look for the expandable row → OCR section appears below "Receipt Details" and "Submission Info"

## 🔄 To Test with New Upload:
1. Go to **Upload Page**
2. Upload a new receipt image
3. Fill in the form
4. Submit
5. Return to Admin Dashboard
6. Expand the new receipt
7. See fresh OCR text extracted by Tesseract!

---

**Note:** OCR text only appears if:
- The receipt has been processed
- The OCR extraction was successful
- The `ocr_raw_text` field has data

If no OCR text exists, the section simply won't appear (no empty boxes).
