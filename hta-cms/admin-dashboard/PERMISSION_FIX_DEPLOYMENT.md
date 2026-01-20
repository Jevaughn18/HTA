# Permission System Fix - Deployment Guide

## 🔧 What Was Fixed

### Issue
Normal admins were seeing delete buttons for other admins (including the super admin), even though they didn't have the `canDeleteAdmins` permission.

### Root Cause
The `canDeleteUser` function in `AuthContext.js` needed more robust permission checking and ID comparison logic.

### Solution Applied
Updated `/admin-dashboard/src/context/AuthContext.js` with:
1. ✅ Improved ID normalization and comparison
2. ✅ Explicit permission checking for admin deletion
3. ✅ Enhanced logging for debugging
4. ✅ Clearer logic flow with early returns

---

## 📋 Deployment Steps

### 1. Verify Local Changes
```bash
cd /Users/jevaughnstewart/HTA/hta-cms/admin-dashboard
git status
```

### 2. Commit Changes
```bash
git add src/context/AuthContext.js
git commit -m "fix: enforce canDeleteAdmins permission check for admin deletion"
```

### 3. Push to Repository
```bash
git push origin main
```

### 4. Vercel Deployment
- Vercel should auto-deploy when you push to main
- Monitor the deployment at: https://vercel.com/dashboard
- Wait for deployment to complete (~2-3 minutes)

---

## ✅ Testing Checklist

### Test 1: Super Admin Account
**Login as:** `admin@htachurch.com`

**Expected Behavior:**
- ✅ Can see "Grant Permission" button for other admins
- ✅ Can see "Delete" button for editors
- ✅ Can see "Delete" button for other admins (not super admin)
- ❌ Cannot see "Delete" button for themselves
- ❌ Cannot see "Delete" button for super admin account

**Console Logs to Verify:**
```
[canDeleteUser] ✅ Admin HAS canDeleteAdmins permission
```

### Test 2: Normal Admin (Without Permission)
**Login as:** Any admin account that is NOT `admin@htachurch.com` and has NOT been granted the permission

**Expected Behavior:**
- ❌ Cannot see "Grant Permission" button (only super admin can grant)
- ✅ Can see "Delete" button for editors
- ❌ **Cannot see "Delete" button for other admins**
- ❌ Cannot see "Delete" button for themselves
- ❌ Cannot see "Delete" button for super admin

**Console Logs to Verify:**
```
[canDeleteUser] ❌ Admin DOES NOT HAVE canDeleteAdmins permission
```

### Test 3: Normal Admin (With Permission Granted)
**Login as:** An admin who has been granted `canDeleteAdmins` permission by the super admin

**Expected Behavior:**
- ❌ Cannot see "Grant Permission" button (only super admin can grant)
- ✅ Can see "Delete" button for editors
- ✅ **Can see "Delete" button for other admins (except super admin)**
- ❌ Cannot see "Delete" button for themselves
- ❌ Cannot see "Delete" button for super admin

**Console Logs to Verify:**
```
[canDeleteUser] ✅ Admin HAS canDeleteAdmins permission
```

---

## 🐛 Debugging

### Check Browser Console
Open browser DevTools (F12) and look for logs starting with `[canDeleteUser]`:

```javascript
[canDeleteUser] Checking delete permission: {
  targetUser: "user@example.com",
  targetRole: "admin",
  currentUser: "admin@htachurch.com",
  currentRole: "admin",
  currentPermissions: { canDeleteAdmins: true, ... },
  canDeleteAdmins: true
}
```

### Verify Backend Permissions
Check that permissions are properly stored in the database:
1. Login to your Render backend
2. Connect to MongoDB
3. Query users:
```javascript
db.users.find({}, { email: 1, role: 1, permissions: 1 })
```

### Common Issues

#### Issue: Normal admin still sees delete buttons
**Solution:** 
- Clear browser cache and hard refresh (Cmd+Shift+R)
- Check that Vercel deployment completed successfully
- Verify the user's permissions in the database

#### Issue: Super admin can't delete anyone
**Solution:**
- Check backend logs on Render
- Verify JWT_SECRET is set in Render environment variables
- Check that super admin email is exactly `admin@htachurch.com` (case-insensitive)

---

## 📊 Permission Matrix

| User Type | Can Delete Editors | Can Delete Admins | Can Grant Permissions |
|-----------|-------------------|-------------------|----------------------|
| Super Admin (`admin@htachurch.com`) | ✅ Yes | ✅ Yes | ✅ Yes |
| Admin (with `canDeleteAdmins`) | ✅ Yes | ✅ Yes (except super) | ❌ No |
| Admin (without permission) | ✅ Yes | ❌ **NO** | ❌ No |
| Editor | ❌ No | ❌ No | ❌ No |

---

## 🔐 Security Notes

1. **Super Admin Protection**: The super admin account (`admin@htachurch.com`) can NEVER be deleted
2. **Self-Deletion Prevention**: Users cannot delete their own account
3. **Permission Persistence**: Permissions are stored in MongoDB and persist across sessions
4. **Backend Validation**: Even if frontend is bypassed, backend validates all delete requests

---

## 📝 Code Changes Summary

### File: `src/context/AuthContext.js`

**Key Changes:**
- Line 103-104: Added ID normalization for proper comparison
- Line 116: Improved self-deletion check with `.toString()` comparison
- Line 127-131: Added explicit admin role check
- Line 140-144: Strict `canDeleteAdmins === true` check for admin deletion
- Added comprehensive logging throughout

**No Backend Changes Required** - The backend was already correctly implemented.
