# API Documentation

## Base URL

```
Development: http://localhost:8000/api
Production: https://yourdomain.com/api
```

## Authentication

All API requests (except auth endpoints) require authentication using Laravel Sanctum tokens.

### Headers

```http
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## Authentication Endpoints

### Register

```http
POST /api/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe"
    },
    "token": "1|abc123..."
  }
}
```

### Login

```http
POST /api/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "2|xyz789..."
  }
}
```

### Logout

```http
POST /api/logout
```

**Headers:** Requires authentication token

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### OAuth Redirect

```http
GET /api/auth/{provider}/redirect
```

**Parameters:**
- `provider`: google | github

**Response:**
```json
{
  "success": true,
  "redirect_url": "https://accounts.google.com/o/oauth2/auth?..."
}
```

### OAuth Callback

```http
GET /api/auth/{provider}/callback?code={code}
```

**Parameters:**
- `provider`: google | github
- `code`: Authorization code from OAuth provider

**Response:** Redirect to frontend with token

---

## User Profile

### Get Profile

```http
GET /api/profile
```

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "+1234567890",
    "bio": "Software Developer",
    "location": "New York, USA",
    "website": "https://johndoe.com",
    "avatar": "https://...",
    "social_links": {
      "github": "johndoe",
      "linkedin": "johndoe",
      "twitter": "johndoe"
    }
  }
}
```

### Update Profile

```http
PUT /api/profile
```

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "phone": "+1234567890",
  "bio": "Full Stack Developer",
  "location": "San Francisco, USA",
  "website": "https://johndoe.dev",
  "github": "johndoe",
  "linkedin": "johndoe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

### Upload Avatar

```http
POST /api/profile/avatar
```

**Request:** multipart/form-data
```
avatar: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "https://storage.../avatars/..."
  }
}
```

---

## Contact Management

### Submit Contact Form

```http
POST /api/contacts
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "name": "Jane Smith",
    "status": "pending"
  }
}
```

### Get Contacts (Admin)

```http
GET /api/admin/contacts?page=1&status=pending
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `status`: pending | read | replied | archived

---

## Enrollment Management

### Create Enrollment

```http
POST /api/enrollments
```

**Request Body:**
```json
{
  "course_name": "Web Development Bootcamp",
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "experience_level": "beginner",
  "message": "I want to learn web development"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrollment submitted successfully",
  "data": {
    "id": 1,
    "course_name": "Web Development Bootcamp",
    "status": "pending"
  }
}
```

---

## Consultation Management

### Book Consultation

```http
POST /api/consultations
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Web Development",
  "preferred_date": "2025-12-30",
  "preferred_time": "14:00",
  "message": "Need consultation on React project"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Consultation booked successfully",
  "data": {
    "id": 1,
    "status": "pending",
    "preferred_date": "2025-12-30"
  }
}
```

---

## Newsletter Management

### Subscribe

```http
POST /api/newsletter/subscribe
```

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

### Unsubscribe

```http
POST /api/newsletter/unsubscribe
```

**Request Body:**
```json
{
  "email": "subscriber@example.com"
}
```

---

## Security Endpoints

### Change Password

```http
POST /api/security/change-password
```

**Request Body:**
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!",
  "new_password_confirmation": "NewPass456!"
}
```

### Enable 2FA

```http
POST /api/security/2fa/enable
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code": "data:image/png;base64,...",
    "secret": "JBSWY3DPEHPK3PXP"
  }
}
```

### Verify 2FA

```http
POST /api/security/2fa/verify
```

**Request Body:**
```json
{
  "code": "123456"
}
```

---

## Admin Endpoints

All admin endpoints require admin role.

### Get All Users

```http
GET /api/admin/users?page=1&search=john
```

### Update User

```http
PUT /api/admin/users/{id}
```

### Delete User

```http
DELETE /api/admin/users/{id}
```

### Get Analytics

```http
GET /api/admin/analytics
```

---

## Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API**: 60 requests per minute
- **Admin API**: 100 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640000000
```

---

## Pagination

List endpoints return paginated results:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7
  },
  "links": {
    "first": "http://api.../users?page=1",
    "last": "http://api.../users?page=7",
    "prev": null,
    "next": "http://api.../users?page=2"
  }
}
```

---

For more details, see [README.md](README.md)
