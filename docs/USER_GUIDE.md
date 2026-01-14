# 👤 User Guide

<div align="center">

**Complete Guide to Using Neverland Studio Portfolio Platform**

Learn how to use all features as a regular user and administrator.

---

</div>

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [User Features](#-user-features)
- [Admin Dashboard](#-admin-dashboard)
- [Account Management](#-account-management)
- [Security Settings](#-security-settings)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Getting Started

### Accessing the Platform

1. **Open your browser**
2. **Navigate to**: Your platform URL (e.g., `https://portfolio.neverlandstudio.my.id`)
3. **Homepage**: You'll see the main landing page

### Creating an Account

#### Method 1: Email Registration

1. **Click "Register"** or "Sign Up" button
2. **Fill in the form**:
   - Full Name
   - Email Address
   - Password (minimum 8 characters)
   - Confirm Password
3. **Click "Create Account"**
4. **Verify Email**: Check your inbox for verification email
5. **Click verification link**
6. **Account Active**: You can now log in!

#### Method 2: Social Login (OAuth)

**Google Login:**
1. Click **"Continue with Google"**
2. Select your Google account
3. Grant permissions
4. Automatically logged in!

**GitHub Login:**
1. Click **"Continue with GitHub"**
2. Authorize the application
3. Automatically logged in!

---

## 👥 User Features

### 1. Contact Form

**Purpose**: Send messages or inquiries to the administrators.

**How to use**:
1. **Navigate** to Contact page
2. **Fill in the form**:
   - Name
   - Email
   - Subject
   - Message
3. **Click "Send Message"**
4. **Confirmation**: You'll see a success message
5. **Response**: Admin will reply to your email

**Screenshot Guide**:
```
┌─────────────────────────────────┐
│      Contact Form               │
├─────────────────────────────────┤
│ Name:     [John Doe        ]   │
│ Email:    [john@email.com  ]   │
│ Subject:  [Inquiry          ]   │
│ Message:  [                ]   │
│           [                ]   │
│           [                ]   │
│                                 │
│         [  Send Message  ]      │
└─────────────────────────────────┘
```

---

### 2. Course Enrollment

**Purpose**: Enroll in available courses or learning programs.

**How to enroll**:
1. **Browse Courses**: Go to "Courses" or "Learning" page
2. **Select Course**: Click on a course you're interested in
3. **Click "Enroll Now"**
4. **Fill enrollment form**:
   - Full Name
   - Email
   - Phone Number
   - Course Selection
   - Additional Information
5. **Submit**
6. **Wait for approval**: Admin will review your enrollment

**Enrollment Status**:
- ⏳ **Pending**: Waiting for admin approval
- ✅ **Approved**: You're enrolled!
- ❌ **Rejected**: Not accepted (with reason)

---

### 3. Consultation Booking

**Purpose**: Book a consultation session with specialists.

**How to book**:
1. **Go to Consultation** page
2. **Click "Book Consultation"**
3. **Fill in details**:
   - Name
   - Email
   - Phone
   - Service Type
   - Preferred Date & Time
   - Description of needs
4. **Submit booking**
5. **Receive confirmation**: Email confirmation sent
6. **Wait for approval**

**Consultation Types**:
- IT Consultation
- Web Development
- Mobile App Development
- UI/UX Design
- Digital Marketing
- Custom Services

---

### 4. Newsletter Subscription

**Purpose**: Receive updates, news, and tips via email.

**How to subscribe**:
1. **Find subscription form** (usually in footer)
2. **Enter your email**
3. **Click "Subscribe"**
4. **Confirmation**: Check your email to confirm subscription

**What you'll receive**:
- Latest news and updates
- Tips and tutorials
- Special offers
- Course announcements

---

## 🎯 Admin Dashboard

### Accessing the Dashboard

1. **Login** with admin account
2. **Automatic redirect** to `/dashboard`
3. **Or click** "Dashboard" in navigation

### Dashboard Overview

```
┌─────────────────────────────────────────────────────┐
│  🏠 Dashboard Overview                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │👥 Users  │ │📬 Contact │ │🎓 Enroll │ │💬 Cons││
│  │   152    │ │    43     │ │   89     │ │  27   ││
│  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📊 Visitor Analytics                       │   │
│  │  [Chart showing visitor trends]             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  📈 Recent Activities                       │   │
│  │  • User "John" registered - 2 min ago       │   │
│  │  • New contact message - 15 min ago         │   │
│  │  • Enrollment approved - 1 hour ago         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Key Features

#### Statistics Cards
- **Real-time counters** for users, contacts, enrollments, consultations
- **Auto-refresh** every 5 seconds
- **Color-coded badges** for new items

#### Analytics Charts
- **Visitor trends** over time
- **Enrollment statistics**
- **Consultation bookings**
- **Interactive charts** (hover for details)

#### Recent Activities
- **Live activity feed**
- **User actions** (login, register, etc.)
- **System events**
- **Timestamped entries**

---

### Managing Users

**Access**: Dashboard → Users

#### View All Users

1. **Click "Users"** in sidebar
2. **See user list** with:
   - Name
   - Email
   - Role (Admin/User)
   - Registration Date
   - Actions

#### Add New User

1. **Click "Add User"** button
2. **Fill in form**:
   - Name
   - Email
   - Password
   - Role (Admin or User)
3. **Click "Create"**
4. **User created**: Appears in list

#### Edit User

1. **Click edit icon** (✏️) next to user
2. **Update information**
3. **Click "Save"**

#### Delete User

1. **Click delete icon** (🗑️)
2. **Confirm deletion**
3. **User removed** from system

⚠️ **Warning**: Deleting a user is permanent and cannot be undone!

---

### Managing Contacts

**Access**: Dashboard → Contacts

#### View Contact Messages

```
┌────────────────────────────────────────────────┐
│  From          │ Subject      │ Date    │ Status│
├────────────────────────────────────────────────┤
│ John Doe       │ Inquiry      │ 2h ago  │ 🆕   │
│ jane@email.com │ Partnership  │ 1d ago  │ 📖   │
│ Bob Smith      │ Question     │ 3d ago  │ 📁   │
└────────────────────────────────────────────────┘
```

**Status indicators**:
- 🆕 **New**: Unread message
- 📖 **Read**: Message has been read
- 📁 **Archived**: Message archived

#### Read a Message

1. **Click on message row**
2. **View full details**:
   - Sender name and email
   - Subject
   - Full message
   - Timestamp
   - IP address (for security)

#### Reply to Message

1. **Click "Reply"** button
2. **Compose response**
3. **Send**: Reply sent to user's email

#### Archive Message

1. **Click "Archive"** button
2. **Message moved** to archived folder
3. **Hidden from main list**

#### Delete Message

1. **Select message(s)**
2. **Click "Delete"**
3. **Confirm**: Message permanently deleted

---

### Managing Enrollments

**Access**: Dashboard → Enrollments

#### View Enrollments

See all course enrollment requests with:
- Student name and contact
- Course selected
- Status (Pending/Approved/Rejected)
- Submission date

#### Approve Enrollment

1. **Click on enrollment**
2. **Review details**
3. **Click "Approve"**
4. **Confirmation email** sent to student

#### Reject Enrollment

1. **Click on enrollment**
2. **Click "Reject"**
3. **Provide reason** (optional)
4. **Notification sent** to student

#### Export Enrollments

1. **Click "Export"** button
2. **Select format** (CSV/Excel)
3. **Download file** with all enrollments

---

### Managing Consultations

**Access**: Dashboard → Consultations

#### View Consultation Requests

```
┌───────────────────────────────────────────────────┐
│ Client     │ Service      │ Date       │ Status   │
├───────────────────────────────────────────────────┤
│ John Doe   │ Web Dev      │ Jan 15     │ ⏳ Pending│
│ Jane Smith │ UI/UX        │ Jan 16     │ ✅ Approved│
│ Bob Wilson │ Marketing    │ Jan 17     │ 🚫 Rejected│
└───────────────────────────────────────────────────┘
```

#### Process Consultation

1. **Review request details**
2. **Check availability**
3. **Approve or Reject**:
   - **Approve**: Confirm date/time
   - **Reject**: Provide reason or alternative

#### Update Consultation Status

- **Scheduled**: Appointment confirmed
- **Completed**: Session finished
- **Cancelled**: Appointment cancelled

---

### Maintenance Mode

**Purpose**: Temporarily disable the website for maintenance.

#### Enable Maintenance Mode

1. **Go to Settings** → **Maintenance**
2. **Click "Enable Maintenance Mode"**
3. **Set custom message** (optional):
   ```
   We're currently upgrading our systems.
   We'll be back soon!
   ```
4. **Add IP whitelist** (optional):
   - Your IP address (to access while in maintenance)
   - Team member IPs
5. **Activate**

**What happens:**
- ⚠️ Regular users see maintenance page
- ✅ Whitelisted IPs can access normally
- ✅ Admin can still access dashboard

#### Disable Maintenance Mode

1. **Go to Settings** → **Maintenance**
2. **Click "Disable Maintenance Mode"**
3. **Website active** again for all users

---

## 👤 Account Management

### Profile Settings

**Access**: Click profile icon → Settings

#### Update Profile Information

1. **Navigate to Profile** section
2. **Edit fields**:
   - Name
   - Email
   - Phone (optional)
   - Bio (optional)
3. **Click "Save Changes"**

#### Change Profile Photo

1. **Click "Upload Photo"** or existing photo
2. **Select image** from computer
3. **Crop image** (optional)
4. **Save**

**Image requirements**:
- Format: JPG, PNG
- Max size: 2MB
- Recommended: Square image (500x500px)

#### Update Email

1. **Enter new email**
2. **Verify with password**
3. **Confirmation sent** to new email
4. **Click link** in email to confirm

---

## 🔒 Security Settings

### Change Password

1. **Go to Security Settings**
2. **Fill in form**:
   - Current Password
   - New Password
   - Confirm New Password
3. **Click "Update Password"**

**Password requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (recommended)

---

### Enable Two-Factor Authentication (2FA)

**What is 2FA?**
Extra security layer requiring a code from your phone in addition to password.

**Setup 2FA**:

1. **Go to Security** → **Two-Factor Authentication**
2. **Click "Enable 2FA"**
3. **Scan QR code** with authenticator app:
   - Google Authenticator (recommended)
   - Microsoft Authenticator
   - Authy
4. **Enter verification code** from app
5. **Save recovery codes** (important!)
6. **2FA enabled** ✅

**Login with 2FA**:
1. Enter email and password
2. Enter 6-digit code from authenticator app
3. Access granted!

**Recovery codes**:
- 📝 Save these codes safely
- Use if you lose your phone
- Each code can be used once

---

### Active Sessions

**View active sessions**:
- Current device
- Other logged-in devices
- Location and browser info
- Last activity time

**Logout from other devices**:
1. **Go to Security** → **Sessions**
2. **Click "Logout All Other Sessions"**
3. **Confirm with password**
4. **All other devices logged out**

---

### Login History

**View recent logins**:
- Date and time
- IP address
- Location (approximate)
- Device and browser
- Status (success/failed)

**Identify suspicious activity**:
- ⚠️ Unknown locations
- ⚠️ Failed login attempts
- ⚠️ Unfamiliar devices

**If you see suspicious activity**:
1. **Change password immediately**
2. **Enable 2FA** if not already
3. **Logout all sessions**
4. **Contact support** if needed

---

## 🔧 Troubleshooting

### Can't Login

**Problem**: "Invalid credentials" error

**Solutions**:
1. ✅ Check email is correct
2. ✅ Check Caps Lock is off
3. ✅ Try "Forgot Password"
4. ✅ Clear browser cache and cookies
5. ✅ Try different browser
6. ✅ Contact admin for support

---

### Not Receiving Emails

**Problem**: Verification or notification emails not arriving

**Solutions**:
1. ✅ Check spam/junk folder
2. ✅ Add sender to contacts
3. ✅ Check email filters
4. ✅ Verify email address is correct
5. ✅ Wait 10-15 minutes (delays possible)
6. ✅ Try resending verification email

---

### Lost 2FA Device

**Problem**: Can't access authenticator app

**Solutions**:
1. ✅ Use recovery codes (saved during setup)
2. ✅ Contact admin with proof of identity
3. ✅ Admin can disable 2FA for your account
4. ✅ Re-enable 2FA with new device

---

### Session Expired

**Problem**: "Session expired" message

**Solution**:
1. ✅ Simply login again
2. ✅ Check "Remember Me" to stay logged in
3. ✅ Clear browser cookies if persists

---

### Upload Failed

**Problem**: Can't upload profile photo or files

**Solutions**:
1. ✅ Check file size (max 2MB for photos)
2. ✅ Check file format (JPG, PNG for photos)
3. ✅ Try smaller file
4. ✅ Try different browser
5. ✅ Check internet connection

---

### Page Not Loading

**Problem**: Blank page or infinite loading

**Solutions**:
1. ✅ Refresh page (F5 or Ctrl+R)
2. ✅ Clear browser cache
3. ✅ Try incognito/private mode
4. ✅ Try different browser
5. ✅ Check internet connection
6. ✅ Check if site is in maintenance mode

---

## 📞 Getting Help

### Support Channels

| Issue Type | Contact Method | Response Time |
|------------|----------------|---------------|
| **Technical Issues** | Email support | 24-48 hours |
| **Account Problems** | Contact form | 24 hours |
| **Urgent Issues** | Admin contact | ASAP |
| **General Questions** | FAQ page | Instant |

### Contact Information

- **Email**: muhammadisakiprananda88@gmail.com
- **Website**: [portfolio.neverlandstudio.my.id](https://portfolio.neverlandstudio.my.id)
- **Contact Form**: Available on website

### Before Contacting Support

**Please provide**:
1. Your account email
2. Description of the problem
3. Steps to reproduce the issue
4. Screenshots (if applicable)
5. Browser and device information

---

## 💡 Tips for Best Experience

### Security Tips

1. ✅ **Use strong password** (mix of letters, numbers, symbols)
2. ✅ **Enable 2FA** for extra security
3. ✅ **Don't share password** with anyone
4. ✅ **Logout on shared devices**
5. ✅ **Keep email secure**
6. ✅ **Review login history** regularly

### Usage Tips

1. ✅ **Keep profile updated** for better communication
2. ✅ **Check notifications** regularly
3. ✅ **Subscribe to newsletter** for updates
4. ✅ **Use contact form** for inquiries
5. ✅ **Bookmark dashboard** for quick access

---

<div align="center">

**Made with ❤️ by [Neverland Studio](https://portfolio.neverlandstudio.my.id)**

[⬆ Back to Top](#-user-guide) • [📖 Documentation](../DOCUMENTATION_GUIDE.md) • [❓ FAQ](FAQ.md)

</div>
