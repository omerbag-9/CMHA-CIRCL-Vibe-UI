# CRCL System - Login Credentials

## Default Test Accounts

The system automatically creates these default accounts on first load:

### Dispatcher Account
- **Email:** `dispatcher@crcl.ca`
- **Password:** `dispatcher123`
- **Role:** Dispatcher
- **Access:** Dashboard, Cases, Chat, Reports

### Crisis Responder Account
- **Email:** `responder@crcl.ca`
- **Password:** `responder123`
- **Role:** Responder
- **Access:** Dashboard, Assigned Cases, Chat

### Agency Manager Account
- **Email:** `manager@crcl.ca`
- **Password:** `manager123`
- **Role:** Agency Manager
- **Access:** Dashboard, Team Management, Reports

### CMHA Admin Account
- **Email:** `admin@crcl.ca`
- **Password:** `admin123`
- **Role:** CMHA Admin
- **Access:** Provincial Dashboard, User Management, All Reports

## Creating New Accounts

You can create new accounts in two ways:

### Method 1: Registration Page
1. Go to `register.html` or click "Create New Account" on the login page
2. Fill in the form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Role (Dispatcher, Responder, Agency Manager, or CMHA Admin)
   - Agency ID (optional, leave blank for admin)
3. Click "Create Account"
4. You'll be redirected to the login page

### Method 2: Browser Console
Open browser console (F12) and run:

```javascript
// Create a new user
dataManager.createUser({
    name: 'Your Name',
    email: 'your-email@example.com',
    password: 'yourpassword',
    role: 'dispatcher', // or 'responder', 'agency_manager', 'cmha_admin'
    agencyId: 'agency1' // optional
});
```

## Resetting Data

To reset all data and restore default accounts:

1. Open browser console (F12)
2. Run:
```javascript
localStorage.clear();
location.reload();
```

This will:
- Clear all users, cases, and messages
- Restore default test accounts
- Reset the system to initial state

## Role Permissions

### Dispatcher
- Create and manage cases
- Assign cases to responders
- Schedule follow-ups
- Chat with responders
- View and update case status
- Close cases

### Responder
- View assigned cases
- Accept/decline case assignments
- Update case status
- Add session notes
- Chat with dispatchers

### Agency Manager
- View agency dashboard
- Manage team members (add/remove responders)
- View agency reports
- Export data

### CMHA Admin
- View provincial overview
- Manage all users and agencies
- View aggregated reports
- System administration

## Notes

- All passwords are stored in plain text for demo purposes
- In production, passwords should be hashed
- Data persists in browser LocalStorage
- Clearing browser data will remove all accounts and cases
- Default accounts are created automatically on first page load

