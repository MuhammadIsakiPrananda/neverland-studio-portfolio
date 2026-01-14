# Photo Profile System - Documentation

## Overview
Sistem photo profile telah diupdate untuk mendukung:
1. ✅ Avatar dari OAuth (Google/GitHub) otomatis tersimpan
2. ✅ Avatar default berdasarkan nama untuk register manual
3. ✅ Upload photo profile custom yang permanen
4. ✅ Photo tersimpan di database dan persistent setelah logout

## Flow Sistem

### 1. Register Manual
```typescript
// authService.ts - register()
- User register dengan nama
- Backend create user tanpa avatar
- Frontend buat default avatar: https://api.dicebear.com/7.x/avataaars/svg?seed={nama}
- Avatar disimpan di userProfile localStorage
```

### 2. OAuth Login (Google/GitHub)
```typescript
// authService.ts - handleOAuthCallback()
- User login via OAuth
- Backend return user dengan avatar dari provider
- Frontend simpan avatar ke userProfile
- Avatar dari Google/GitHub langsung digunakan
```

### 3. Upload Custom Photo
```typescript
// ProfileEditModal.tsx - handleFileChange()
- User klik camera icon
- Select image (JPG, PNG, WebP, max 5MB)
- Image di-resize otomatis (max 800x800px)
- Convert to base64 dengan quality 0.9
- Simpan ke state profile.avatar

// ProfileEditModal.tsx - handleUpdateProfile()
- Submit profile data ke backend
- Backend simpan avatar (base64) ke database
- Fetch fresh data dari backend
- Update localStorage userProfile
- Avatar menjadi permanen
```

### 4. Persistent Storage
```
localStorage:
- auth_token: JWT token
- user: Basic user data dari backend
- userProfile: Complete profile termasuk custom avatar
- auth_mode: 'backend'

Database (Backend):
- users.avatar: Base64 encoded image atau URL
```

## API Endpoints

### Profile Management
```
GET  /api/profile          - Get user profile
PUT  /api/profile          - Update profile (includes avatar)
POST /api/profile/avatar   - Upload avatar only
DELETE /api/profile/avatar - Reset to default
```

### OAuth
```
GET /api/auth/google/redirect  - Get OAuth URL
GET /api/auth/google/callback  - Handle callback
GET /api/auth/github/redirect  - Get OAuth URL  
GET /api/auth/github/callback  - Handle callback
```

## Files Modified

### Frontend
1. `src/services/authService.ts`
   - Updated register() - create userProfile dengan default avatar
   - Updated login() - load avatar dari database
   - Updated handleOAuthCallback() - simpan OAuth avatar

2. `src/services/apiService.ts`
   - profileService.updateProfile() - update semua data termasuk avatar
   - profileService.uploadAvatar() - dedicated avatar upload
   - profileService.deleteAvatar() - reset avatar

3. `src/components/common/ProfileEditModal.tsx`
   - handleFileChange() - validate & resize image
   - handleUpdateProfile() - simpan ke backend & update localStorage
   - Avatar preview with camera icon

4. `src/App.tsx`
   - Load userProfile dari localStorage on init
   - Sync dengan backend setelah login
   - Avatar persistent setelah logout/login

## Usage Example

### Upload Custom Photo
```tsx
// User clicks camera icon
<div onClick={handleAvatarClick}>
  <Camera />
</div>

// File input hidden
<input 
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
/>

// Image processed
- Validate type & size
- Resize if needed
- Convert to base64
- Save to database
```

### Display Avatar
```tsx
// ProfileDropdown, Navbar, Dashboard
{userProfile.avatar && (
  <img src={userProfile.avatar} alt={userProfile.name} />
)}
```

## Testing Checklist

- [ ] Register manual - default avatar muncul
- [ ] Login Google - avatar dari Google muncul
- [ ] Login GitHub - avatar dari GitHub muncul
- [ ] Upload custom photo - berhasil tersimpan
- [ ] Logout & login lagi - custom photo masih ada
- [ ] Update profile lain - avatar tidak berubah
- [ ] Image validation - reject file besar/invalid
- [ ] Resize works - max 800x800px
- [ ] Performance - loading cepat

## Notes

1. **Avatar Storage**: Backend bisa simpan sebagai:
   - Base64 di database (simple tapi besar)
   - Upload ke storage (S3, CloudStorage) lalu simpan URL
   - Pilihan tergantung backend implementation

2. **Image Optimization**:
   - Max size: 5MB
   - Auto resize: 800x800px
   - Quality: 0.9
   - Format: JPG, PNG, WebP

3. **Default Avatar**: 
   - Provider: DiceBear API
   - Style: Avataaars
   - Seed: User name
   - Always unique per user

4. **OAuth Avatar Priority**:
   1. Custom uploaded avatar (highest)
   2. OAuth provider avatar
   3. Default generated avatar (lowest)
