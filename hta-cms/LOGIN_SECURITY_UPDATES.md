# Login Security Updates

## Summary
Updated the login security system to improve user experience while maintaining security:

### Changes Made

#### 1. **Reduced Lockout Time: 15 minutes → 1 minute**
   - Users are now locked out for only **1 minute** instead of 15 minutes after exceeding login attempts
   - More user-friendly while still preventing brute-force attacks

#### 2. **Added Remaining Attempts Counter**
   - Users now see how many login attempts they have remaining
   - Example error messages:
     - `Invalid email or password (4 attempts remaining)`
     - `Invalid email or password (1 attempt remaining)`
     - `Too many login attempts. Please wait 1 minute before trying again.`

#### 3. **Smart Attempt Tracking**
   - Only failed login attempts are counted (successful logins reset the counter)
   - Attempts are tracked per IP address
   - Automatic cleanup of old attempt records

### Technical Details

**Backend Changes:**
- **File:** `/backend/server.js`
  - Updated `authLimiter` window from 15 minutes to 1 minute
  - Added custom handler to return structured error responses
  - Enabled `skipSuccessfulRequests` to only count failed attempts

- **File:** `/backend/routes/auth.js`
  - Added in-memory login attempt tracking with Map
  - Track attempts per IP address
  - Return `remainingAttempts` in error responses
  - Clear attempts on successful login
  - Automatic cleanup of expired attempt records

**Frontend Changes:**
- **File:** `/src/context/AuthContext.js`
  - Updated default retry time from 15 to 1 minute
  - Pass through `remainingAttempts` from backend

- **File:** `/src/pages/Login.js`
  - Display remaining attempts in error messages
  - Show user-friendly lockout message when attempts exhausted

### Configuration
- **Max Attempts:** 5 failed attempts
- **Lockout Duration:** 1 minute
- **Tracking Method:** IP-based with in-memory storage
- **Auto-cleanup:** Every 60 seconds

### User Experience Examples

**Scenario 1: First failed attempt**
```
Error: Invalid email or password (4 attempts remaining)
```

**Scenario 2: Fourth failed attempt**
```
Error: Invalid email or password (1 attempt remaining)
```

**Scenario 3: Fifth failed attempt (locked out)**
```
Error: Too many login attempts. Please wait 1 minute before trying again.
```

**Scenario 4: Successful login**
```
✓ Login successful - attempt counter is reset
```

### Security Considerations
- Timing attack mitigation still in place (random delay)
- IP-based tracking prevents per-user enumeration
- Rate limiting still active at both application and route level
- Successful logins don't count toward the limit
