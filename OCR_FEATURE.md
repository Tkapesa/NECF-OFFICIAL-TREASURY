# OCR Extracted Text Display Feature

## What Was Added

We've added a new section to display the **OCR extracted text** from receipts in the admin dashboard!

## Features

### 📝 Desktop View
When you expand a receipt row (click the down arrow), you'll now see:
1. **Receipt Details** - Item, Amount, Date & Time
2. **Submission Info** - Submitted By, Contact, Approved By
3. **NEW: OCR Extracted Text** - The raw text extracted from the receipt image
4. **Receipt Image** - View the actual receipt

### 📱 Mobile View
When you tap "Show More" on a receipt card, you'll see:
- All the receipt details
- **NEW: OCR Extracted Text** in a scrollable box
- Button to view full-size image

## Visual Design

The OCR text is displayed in:
- ✅ Light gray background box with dashed border
- ✅ Monospace font (code-style) for readability
- ✅ Scrollable container (max height: 200px for desktop, 150px for mobile)
- ✅ Pre-formatted text that preserves line breaks and spacing
- ✅ Icon indicator: 📝 "OCR Extracted Text"

## Database Field

The OCR text is stored in the database as:
- Field name: `ocr_raw_text`
- Type: Text
- Nullable: Yes (some old receipts may not have OCR data)

## How It Works

1. **Upload**: When a user uploads a receipt, Tesseract OCR automatically extracts text
2. **Storage**: The raw extracted text is saved to the `ocr_raw_text` field
3. **Display**: Admins can view this text in the expandable section of each receipt
4. **Use Case**: Helps admins verify OCR accuracy and see all extracted information

## Example Usage

When you expand a receipt, you'll see something like:

```
📝 OCR Extracted Text
┌─────────────────────────────────────┐
│ WALMART                             │
│ 123 Main Street                     │
│ Springfield, IL                     │
│                                     │
│ Item: Groceries                     │
│ Total: $45.99                       │
│ Date: 11/10/2025                    │
│ Time: 3:45 PM                       │
└─────────────────────────────────────┘
```

## Benefits

✅ **Transparency** - See exactly what the OCR system detected
✅ **Verification** - Compare OCR extraction with the actual image
✅ **Data Recovery** - Find information that might have been missed in structured fields
✅ **Debugging** - Helps troubleshoot OCR accuracy issues

## Note

If a receipt doesn't have OCR text, the section simply won't appear. This is normal for:
- Receipts uploaded before OCR was implemented
- Receipts where OCR failed or wasn't run
- Test data without OCR processing
