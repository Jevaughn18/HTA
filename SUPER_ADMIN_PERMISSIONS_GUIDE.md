# Super Admin Permissions System - HTA CMS

## 🔐 Overview

Your HTA CMS now has a **3-tier permission system** with enhanced security controls for admin management.

---

## 👥 Permission Tiers

### 1. **Super Admin** (admin@htachurch.com)
- **Unlimited Power** - Has all permissions automatically
- Can delete ANY admin account (except their own)
- Can delete ANY editor account
- Can **grant** admin deletion permissions to other admins
- Can **revoke** admin deletion permissions from other admins
- **Cannot be deleted** by anyone (protected account)

### 2. **Admin with Delete Permission**
- Has been granted `canDeleteAdmins` permission by super admin
- Can delete other admin accounts
- Can delete editor accounts
- **Cannot** grant permissions to other admins (only super admin can)
- **Can be deleted** by super admin

### 3. **Regular Admin**
- Default admin permissions
- Can delete **editor accounts only**
- **Cannot** delete other admin accounts
- **Cannot** grant any permissions
- Must contact super admin to delete an admin

### 4. **Editor**
- Basic CMS access
- Cannot delete any users
- Cannot create users

---

## 🛡️ Security Rules Enforced

### Protection Rules:
1. ✅ **Super Admin Protection** - `admin@htachurch.com` cannot be deleted by anyone
2. ✅ **Self-Deletion Block** - Users cannot delete their own accounts
3. ✅ **Permission-Based Admin Deletion** - Only super admin or authorized admins can delete admins
4. ✅ **Editor Deletion** - Any admin can delete editors
5. ✅ **Permission Grant Restriction** - Only super admin can grant/revoke `canDeleteAdmins` permission

---

## 📋 What You'll See as Different Users

### As Super Admin (admin@htachurch.com):

**Login Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Super Admin",
    "email": "admin@htachurch.com",
    "role": "admin",
    "permissions": {
      "canDeleteAdmins": true,
      "canGrantAdminDelete": true,
      "isSuperAdmin": true
    }
  }
}
```

**What You Can Do:**
- ✅ Delete ANY admin (except yourself)
- ✅ Delete ANY editor
- ✅ Grant admin deletion permission to other admins
- ✅ Revoke admin deletion permission from admins
- ✅ See "Grant Permissions" button next to admin names
- ✅ See delete button on ALL users (except yourself)

---

### As Admin with Delete Permission:

**Login Response:**
```json
{
  "permissions": {
    "canDeleteAdmins": true,
    "canGrantAdminDelete": false,
    "isSuperAdmin": false
  }
}
```

**What You Can Do:**
- ✅ Delete other admin accounts
- ✅ Delete editor accounts
- ❌ Cannot grant permissions (no "Grant Permissions" button)
- ❌ Cannot delete super admin (admin@htachurch.com)

**What You'll See:**
- Delete button appears on other admins
- No "Grant Permissions" button (only super admin has this)

---

### As Regular Admin (No Special Permissions):

**Login Response:**
```json
{
  "permissions": {
    "canDeleteAdmins": false,
    "canGrantAdminDelete": false,
    "isSuperAdmin": false
  }
}
```

**What You Can Do:**
- ✅ Delete editor accounts
- ❌ Cannot delete admin accounts
- ❌ Cannot grant permissions

**What You'll See:**
- Delete button only on editors
- **No delete button on admin accounts**
- Error if attempting to delete admin: *"Only the super admin (admin@htachurch.com) or admins with delete permissions can delete admin accounts"*

---

## 🔧 API Endpoints

### 1. Delete User (Permission-Based)
```http
DELETE /api/auth/users/:id
Authorization: Bearer <token>
```

**Behavior:**
- Editors: Any admin can delete
- Admins: Only super admin or admins with `canDeleteAdmins` permission
- Super Admin (admin@htachurch.com): Cannot be deleted

**Error Responses:**
```json
// Trying to delete admin without permission
{
  "error": "Only the super admin (admin@htachurch.com) or admins with delete permissions can delete admin accounts"
}

// Trying to delete super admin
{
  "error": "Cannot delete the super admin account (admin@htachurch.com)"
}

// Trying to delete yourself
{
  "error": "Cannot delete your own account"
}
```

---

### 2. Grant Admin Delete Permission (Super Admin Only)
```http
PATCH /api/auth/users/:id/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "canDeleteAdmins": true
}
```

**Who Can Use:** Only `admin@htachurch.com`

**Success Response:**
```json
{
  "message": "Admin deletion permission granted to John Doe",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "permissions": {
      "canDeleteAdmins": true
    }
  }
}
```

**To Revoke Permission:**
```json
{
  "canDeleteAdmins": false
}
```

**Error Response (Non-Super Admin):**
```json
{
  "error": "Only the super admin (admin@htachurch.com) can grant admin deletion permissions"
}
```

---

### 3. Get Current User (Includes Permissions)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "name": "Your Name",
    "email": "you@example.com",
    "role": "admin",
    "requirePasswordChange": false,
    "permissions": {
      "canDeleteAdmins": false,
      "canGrantAdminDelete": false,
      "isSuperAdmin": false
    }
  }
}
```

---

## 💡 Usage Examples

### Example 1: Super Admin Grants Permission

**Scenario:** Super admin wants to allow "john@example.com" to delete other admins.

```bash
curl -X PATCH http://localhost:5001/api/auth/users/<john-user-id>/permissions \
  -H "Authorization: Bearer <super-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"canDeleteAdmins": true}'
```

**Result:** John can now delete other admin accounts.

---

### Example 2: Regular Admin Tries to Delete Admin

**Scenario:** "jane@example.com" (regular admin) tries to delete another admin.

```bash
curl -X DELETE http://localhost:5001/api/auth/users/<admin-user-id> \
  -H "Authorization: Bearer <jane-token>"
```

**Response:**
```json
{
  "error": "Only the super admin (admin@htachurch.com) or admins with delete permissions can delete admin accounts"
}
```

**Result:** Delete fails - Jane needs permission first.

---

### Example 3: Admin with Permission Deletes Admin

**Scenario:** "john@example.com" (has canDeleteAdmins) deletes another admin.

```bash
curl -X DELETE http://localhost:5001/api/auth/users/<admin-user-id> \
  -H "Authorization: Bearer <john-token>"
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUser": {
    "name": "Bob Smith",
    "email": "bob@example.com",
    "role": "admin"
  }
}
```

**Result:** Delete succeeds - John has permission.

---

## 🎨 Frontend Implementation Guide

To implement this in your Dashboard, you'll need to:

### 1. Update AuthContext to Store Permissions
```javascript
const [user, setUser] = useState(null);

// After login or auth check:
setUser({
  ...userData,
  permissions: userData.permissions // Now includes permissions
});
```

### 2. Conditionally Show Delete Buttons
```javascript
const canDeleteUser = (userToDelete) => {
  // Can always delete yourself? No.
  if (userToDelete.id === currentUser.id) return false;

  // Deleting an editor
  if (userToDelete.role === 'editor') {
    return currentUser.role === 'admin';
  }

  // Deleting an admin
  if (userToDelete.role === 'admin') {
    // Can't delete super admin
    if (userToDelete.email === 'admin@htachurch.com') return false;

    // Need permission to delete admins
    return currentUser.permissions?.canDeleteAdmins === true;
  }

  return false;
};

// In your user list:
{canDeleteUser(user) && (
  <button onClick={() => handleDeleteUser(user.id)}>
    Delete
  </button>
)}
```

### 3. Show Grant Permissions Button (Super Admin Only)
```javascript
{currentUser.permissions?.canGrantAdminDelete && user.role === 'admin' && (
  <button onClick={() => handleGrantPermission(user.id)}>
    {user.permissions?.canDeleteAdmins ? '✓ Can Delete Admins' : 'Grant Delete Permission'}
  </button>
)}
```

---

## 🔍 How to Check Your Permissions

### Via Browser DevTools:
1. Login to admin dashboard
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `localStorage.getItem('token')`
5. Decode JWT at https://jwt.io
6. Or check the API: `GET /api/auth/me`

### Via API:
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Database Schema Changes

### User Model Updated:
```javascript
{
  name: String,
  email: String,
  password: String,
  role: 'admin' | 'editor',
  permissions: {
    canDeleteAdmins: Boolean,  // NEW
    canGrantAdminDelete: Boolean  // NEW (always false, computed from email)
  },
  isActive: Boolean,
  requirePasswordChange: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** `canGrantAdminDelete` is computed, not stored. Only `admin@htachurch.com` has this.

---

## ✅ Testing Checklist

### As Super Admin (admin@htachurch.com):
- [ ] Can login successfully
- [ ] Can see `isSuperAdmin: true` in permissions
- [ ] Can delete other admins
- [ ] Can delete editors
- [ ] Cannot delete yourself
- [ ] Can grant `canDeleteAdmins` to other admins
- [ ] Can revoke `canDeleteAdmins` from other admins
- [ ] Cannot be deleted by anyone

### As Admin with Permission:
- [ ] Can login successfully
- [ ] Can see `canDeleteAdmins: true` in permissions
- [ ] Can delete other admins
- [ ] Can delete editors
- [ ] Cannot delete super admin
- [ ] Cannot grant permissions to others

### As Regular Admin:
- [ ] Can login successfully
- [ ] Can see `canDeleteAdmins: false` in permissions
- [ ] Can delete editors
- [ ] Cannot delete other admins (gets error)
- [ ] Cannot delete super admin
- [ ] Cannot grant permissions

---

## 🚀 Migration Steps

If you have existing admins in your database:

### 1. Update Super Admin Account:
```bash
# In MongoDB, set the super admin email
db.users.updateOne(
  { email: 'admin@htachurch.com' },
  {
    $set: {
      'permissions.canDeleteAdmins': true
    }
  }
)
```

### 2. All Other Admins:
```bash
# Default permissions for existing admins
db.users.updateMany(
  {
    role: 'admin',
    email: { $ne: 'admin@htachurch.com' }
  },
  {
    $set: {
      'permissions.canDeleteAdmins': false
    }
  }
)
```

---

## 📝 Summary

**Super Admin (admin@htachurch.com):**
- Can do EVERYTHING
- Cannot be deleted
- Can grant permissions

**Admin with canDeleteAdmins:**
- Can delete any admin (except super admin)
- Needs permission granted by super admin

**Regular Admin:**
- Can only delete editors
- Needs permission to delete admins

**All Admins:**
- Cannot delete themselves
- Cannot grant permissions (only super admin)

---

*Implementation completed: January 20, 2026*
*Designed for HTA CMS Security Enhancement*
