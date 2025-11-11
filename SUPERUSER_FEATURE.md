# 🔐 Superuser & Admin Management System

## Overview

The NECF Treasury System now includes a complete **Superuser and Admin Management** system that allows authorized users to manage admin accounts with role-based permissions.

---

## 🎯 Features

### Superuser Capabilities
✅ **Create Admin Accounts** - Add new admins with regular or superuser privileges  
✅ **Delete Admin Accounts** - Remove admin accounts (with safety checks)  
✅ **View All Admins** - See complete list of admin users with their roles  
✅ **Protected System** - Cannot delete self or last superuser  

### Role-Based Access Control
- **Superuser**: Highest privileges, can manage other admins
- **Regular Admin**: Can manage receipts and view data (cannot manage admins)

---

## 📦 What Was Added

### Backend Changes

1. **Database Schema Update** (`models.py`)
   - Added `is_superuser` boolean column to `admins` table
   - Default value: `False`
   - Migration-safe: existing data preserved

2. **New API Endpoints** (`main.py`)
   ```
   GET  /api/admins           - List all admins (superuser only)
   POST /api/admins           - Create new admin (superuser only)
   DELETE /api/admins/{id}    - Delete admin (superuser only)
   ```

3. **Enhanced Authentication**
   - Login now returns `is_superuser` status
   - JWT tokens include superuser claim
   - All admin management routes protected by superuser check

4. **Safety Features**
   - Cannot delete own account
   - Cannot delete last superuser
   - Password validation (minimum 6 characters)
   - Username uniqueness check

5. **Migration Script** (`migrate_superuser.py`)
   - Safely adds `is_superuser` column without data loss
   - Automatically upgrades default `admin` user to superuser
   - Shows current admin status after migration

### Frontend Changes

1. **New Component** (`AdminManagement.jsx`)
   - Beautiful Material-UI interface
   - Create admin dialog with role selection
   - Admin table with role badges
   - Delete functionality with confirmation
   - Real-time updates and notifications

2. **Updated Dashboard** (`AdminDashboard.jsx`)
   - Added "Admin Management" menu item (superuser only)
   - State management for superuser status
   - View switching between dashboard and admin management
   - Stores superuser status in localStorage

3. **Enhanced Login**
   - Captures and stores `is_superuser` flag
   - Persists across page refreshes
   - Clears on logout

---

## 🚀 How to Use

### For Superusers

#### 1. Login as Superuser
The default admin account is automatically a superuser:
```
Username: admin
Password: admin123
```

#### 2. Access Admin Management
- Click "Admin Management" in the sidebar (only visible to superusers)
- View all existing admin accounts

#### 3. Create New Admin
1. Click "Create Admin" button
2. Enter username and password (min 6 characters)
3. Check "Make Superuser" if you want to grant superuser privileges
4. Click "Create Admin"

#### 4. Delete Admin
1. Click the delete icon (🗑️) next to any admin
2. Confirm deletion
3. Admin is removed from system

**Safety Checks:**
- ❌ Cannot delete your own account
- ❌ Cannot delete the last superuser

---

## 🔧 Setup & Migration

### First Time Setup

The system automatically runs the migration on startup and creates a superuser admin account.

### Manual Migration (if needed)

If you need to manually add the superuser column to an existing database:

```bash
cd backend
source venv/bin/activate
python migrate_superuser.py
```

This will:
1. Add the `is_superuser` column if it doesn't exist
2. Make the default `admin` user a superuser
3. Show current admin status

---

## 🛡️ Security Features

### Authentication
- JWT-based authentication with role claims
- Superuser status embedded in tokens
- Token validation on every admin management request

### Authorization
- All admin management endpoints require superuser role
- 403 Forbidden response for non-superusers
- Role-based UI rendering (menu items only show to superusers)

### Data Protection
- Password hashing with bcrypt
- Cannot delete self (prevents lockout)
- Cannot delete last superuser (prevents system orphan)
- Unique username constraint

---

## 📡 API Examples

### 1. Login (Get Superuser Status)
```bash
curl -X POST http://localhost:8000/api/login \
  -F "username=admin" \
  -F "password=admin123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "is_superuser": true,
  "username": "admin"
}
```

### 2. Get All Admins (Superuser Only)
```bash
TOKEN="your_token_here"
curl http://localhost:8000/api/admins \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "admins": [
    {
      "id": 1,
      "username": "admin",
      "is_superuser": true,
      "created_at": "2025-11-09T18:27:00"
    }
  ]
}
```

### 3. Create New Admin (Superuser Only)
```bash
curl -X POST http://localhost:8000/api/admins \
  -H "Authorization: Bearer $TOKEN" \
  -F "username=newadmin" \
  -F "password=securepass123" \
  -F "is_superuser=false"
```

Response:
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": 2,
    "username": "newadmin",
    "is_superuser": false,
    "created_at": "2025-11-11T23:00:00"
  }
}
```

### 4. Delete Admin (Superuser Only)
```bash
curl -X DELETE http://localhost:8000/api/admins/2 \
  -H "Authorization: Bearer $TOKEN"
```

Response:
```json
{
  "message": "Admin deleted successfully",
  "username": "newadmin"
}
```

---

## 🎨 User Interface

### Admin Management Screen

The interface includes:
- **Header Card** - Shows admin management title and create button
- **Admin Table** - Displays all admins with:
  - ID
  - Username
  - Role badge (Superuser/Admin)
  - Created timestamp
  - Delete action
- **Create Dialog** - Modal form for adding new admins
- **Notifications** - Success/error messages via snackbar

### Design Highlights
- Consistent NECF maroon theme (#6B1C23)
- Material-UI components
- Responsive layout
- Animated transitions
- Clear role differentiation with icons and badges

---

## 🔍 Database Schema

### Updated `admins` Table

```sql
CREATE TABLE admins (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**New Column:**
- `is_superuser`: Boolean flag indicating superuser status
- Default: `0` (False)
- Not null with default ensures backward compatibility

---

## ⚠️ Important Notes

### Default Superuser
- Username: `admin`
- Password: `admin123`
- **Change this immediately in production!**

### First Superuser
- The first admin (usually `admin`) is automatically made a superuser
- This happens during migration and application startup
- Ensures there's always at least one superuser

### Safety Mechanisms
1. **Cannot Delete Self**: Prevents accidental lockout
2. **Last Superuser Protection**: Ensures admin management capability persists
3. **Password Validation**: Minimum length enforcement
4. **Username Uniqueness**: Prevents conflicts

---

## 🔄 Migration Path

### Existing Installations
If you have an existing treasury system:

1. **Pull Latest Code**
   ```bash
   git pull origin main
   ```

2. **Backend Updates**
   ```bash
   cd backend
   source venv/bin/activate
   python migrate_superuser.py
   ```

3. **Restart Backend**
   ```bash
   ./venv/bin/python -m uvicorn main:app --reload --port 8000
   ```

4. **Frontend Updates**
   ```bash
   cd ../frontend
   npm install  # if new dependencies
   npm run dev
   ```

### New Installations
The migration runs automatically on first startup. No manual steps required.

---

## 🧪 Testing

### Test Superuser Features

1. **Login as Superuser**
   - Use default `admin` credentials
   - Verify "Admin Management" menu appears

2. **Create Admin**
   - Click "Admin Management"
   - Create a regular admin (uncheck superuser)
   - Verify admin appears in table with "Admin" badge

3. **Create Superuser**
   - Create another admin with superuser checked
   - Verify "Superuser" badge appears

4. **Test Permissions**
   - Logout and login as regular admin
   - Verify "Admin Management" menu does NOT appear
   - Try accessing `/api/admins` - should get 403 Forbidden

5. **Test Safety**
   - As superuser, try to delete yourself - should fail
   - Delete all other superusers except yourself - last one should fail

---

## 📝 Future Enhancements

Possible additions for v2:
- [ ] Admin edit capabilities (change password, upgrade to superuser)
- [ ] Admin activity logs
- [ ] Password reset functionality
- [ ] More granular permissions (viewer, editor, approver)
- [ ] Bulk admin operations
- [ ] Admin search and filtering
- [ ] Email notifications for new admins

---

## 🆘 Troubleshooting

### "Admin Management" Menu Not Showing
- **Cause**: You're logged in as regular admin, not superuser
- **Solution**: Login with superuser credentials or upgrade your account

### "Superuser access required" Error
- **Cause**: Trying to access admin endpoints without superuser privileges
- **Solution**: Ensure you're logged in with a superuser account

### Migration Issues
- **Cause**: Database locked or permissions issue
- **Solution**:
  1. Stop the backend server
  2. Run `python migrate_superuser.py`
  3. Restart backend

### Column Already Exists
- **Message**: "is_superuser column already exists!"
- **Status**: ✅ This is normal - migration is already complete

---

## 📄 Files Modified/Added

### Backend
- ✅ `models.py` - Added `is_superuser` column
- ✅ `main.py` - Added admin management endpoints and superuser logic
- ✅ `migrate_superuser.py` - NEW: Migration script

### Frontend
- ✅ `components/AdminManagement.jsx` - NEW: Admin management interface
- ✅ `pages/AdminDashboard.jsx` - Added superuser state and menu integration

---

## 🎉 Summary

The superuser system provides:
1. **Secure** admin account management
2. **Role-based** access control
3. **Safe** operations with built-in protections
4. **Easy** migration from existing systems
5. **Beautiful** user interface

**Default superuser:**
- Username: `admin`
- Password: `admin123`
- **Remember to change this in production!**

---

**Built with ❤️ for NECF Treasury Management**
