# 📚 Neverland Studio Portfolio - Feature Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Maintenance Mode System](#maintenance-mode-system)
- [Real-time Dashboard Features](#real-time-dashboard-features)
- [Dynamic Badge System](#dynamic-badge-system)
- [Technical Implementation](#technical-implementation)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This document provides comprehensive documentation for all custom features implemented in the Neverland Studio Portfolio dashboard system. The features are designed to enhance user experience with real-time updates, dynamic notifications, and maintenance management capabilities.

### Key Features

| Feature | Status | Description |
|---------|--------|-------------|
| Maintenance Mode | ✅ Active | Website-wide maintenance control with whitelist |
| Real-time Consultations | ✅ Active | Live booking updates every 3 seconds |
| Real-time Enrollments | ✅ Active | Live enrollment updates every 3 seconds |
| Dynamic Badges | ✅ Active | Real-time notification badges in sidebar |
| Live Indicators | ✅ Active | Visual real-time status indicators |

---

## 🔧 Maintenance Mode System

### Overview

The Maintenance Mode system allows administrators to temporarily close the website for maintenance while providing custom messaging to visitors. Dashboard access remains available, and specific IP addresses can be whitelisted to bypass maintenance mode.

### Features

#### ✨ Core Capabilities

- **Toggle ON/OFF** - Simple switch to activate/deactivate maintenance mode
- **Custom Messaging** - Personalize title and message shown to visitors
- **Estimated Time** - Optional completion time display
- **IP Whitelist** - Allow specific IPs to bypass maintenance
- **Dashboard Access** - Admin dashboard remains accessible during maintenance
- **Real-time Status** - Auto-check every 30 seconds on frontend

#### 🎨 User Interface

**Location**: Dashboard → Settings → Maintenance Tab

**Components**:
- Status toggle switch (Red when active, Gray when inactive)
- Maintenance title input field
- Maintenance message textarea (4 rows)
- Estimated time input (optional)
- IP whitelist management (Add/Remove IPs)
- Save button with loading state

**Visual Indicators**:
```
✓ Website is running normally (Green badge)
⚠️ Website is currently in maintenance mode (Red badge with pulse animation)
```

### Database Schema

**Table**: `maintenance_settings`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | BIGINT UNSIGNED | NO | AUTO_INCREMENT | Primary key |
| `is_active` | BOOLEAN | NO | `false` | Maintenance mode status |
| `title` | VARCHAR(255) | NO | `'Website Under Maintenance'` | Page title |
| `message` | TEXT | YES | - | Detailed message to visitors |
| `estimated_time` | VARCHAR(255) | YES | - | Expected completion time |
| `allowed_ips` | JSON | YES | - | Array of whitelisted IPs |
| `created_at` | TIMESTAMP | YES | - | Creation timestamp |
| `updated_at` | TIMESTAMP | YES | - | Last update timestamp |

### API Endpoints

#### Public Endpoint

```http
GET /api/maintenance/status
```

**Description**: Check if maintenance mode is active

**Response**:
```json
{
  "success": true,
  "is_maintenance": false,
  "data": null
}
```

**When Active**:
```json
{
  "success": true,
  "is_maintenance": true,
  "data": {
    "title": "Website Under Maintenance",
    "message": "We are currently performing maintenance...",
    "estimated_time": "2 hours"
  }
}
```

#### Admin Endpoints

##### Get Settings

```http
GET /api/admin/maintenance
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "is_active": false,
    "title": "Website Under Maintenance",
    "message": "We are currently performing scheduled maintenance...",
    "estimated_time": null,
    "allowed_ips": [],
    "created_at": "2025-12-31T00:00:00.000000Z",
    "updated_at": "2025-12-31T00:00:00.000000Z"
  }
}
```

##### Update Settings

```http
PUT /api/admin/maintenance
Content-Type: application/json
```

**Request Body**:
```json
{
  "is_active": true,
  "title": "Website Under Maintenance",
  "message": "We are performing scheduled maintenance. We will be back soon!",
  "estimated_time": "2 hours",
  "allowed_ips": ["192.168.1.1", "10.0.0.1"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Maintenance settings updated successfully",
  "data": {
    "id": 1,
    "is_active": true,
    "title": "Website Under Maintenance",
    "message": "We are performing scheduled maintenance...",
    "estimated_time": "2 hours",
    "allowed_ips": ["192.168.1.1", "10.0.0.1"],
    "created_at": "2025-12-31T00:00:00.000000Z",
    "updated_at": "2026-01-01T10:30:00.000000Z"
  }
}
```

### Frontend Implementation

#### Component Location

- **Settings Page**: `/src/components/dashboard/Settings.tsx`
- **Maintenance Page**: `/src/components/pages/MaintenancePage.tsx`
- **App Integration**: `/src/App.tsx`

#### Key Functions

```typescript
// Load maintenance settings
const loadMaintenanceSettings = async () => {
  const response = await apiService.get('/admin/maintenance');
  if (response.data.success) {
    setMaintenanceSettings(response.data.data);
  }
};

// Toggle maintenance mode
const handleMaintenanceToggle = async () => {
  const response = await apiService.put('/admin/maintenance', {
    ...maintenanceSettings,
    is_active: !maintenanceSettings.is_active,
  });
};

// Save settings
const handleMaintenanceSave = async () => {
  const response = await apiService.put('/admin/maintenance', maintenanceSettings);
};
```

#### Status Check (Frontend)

```typescript
// Check every 30 seconds
useEffect(() => {
  const checkMaintenanceMode = async () => {
    if (location.pathname.startsWith('/dashboard')) return;
    
    const response = await apiService.get('/maintenance/status');
    if (response.data.success) {
      setIsMaintenance(response.data.is_maintenance);
      setMaintenanceData(response.data.data);
    }
  };

  checkMaintenanceMode();
  const interval = setInterval(checkMaintenanceMode, 30000);
  return () => clearInterval(interval);
}, [location.pathname]);
```

### Usage Guide

#### Step 1: Access Maintenance Settings

1. Login to Dashboard
2. Navigate to **Settings** (sidebar)
3. Click on **Maintenance** tab

#### Step 2: Configure Maintenance Mode

**Basic Configuration**:
- Set maintenance title (displayed prominently)
- Write custom message for visitors
- Add estimated time (optional)

**IP Whitelist** (Optional):
- Enter IP address in input field
- Click "Add" to whitelist
- IP can access website normally during maintenance
- Click "Remove" to delete from whitelist

#### Step 3: Activate Maintenance

- Toggle switch to **ON** (turns red)
- Click **"Save Maintenance Settings"**
- Website immediately enters maintenance mode
- Verify by opening website in incognito/different browser

#### Step 4: Deactivate Maintenance

- Toggle switch to **OFF** (turns gray)
- Click **"Save Maintenance Settings"**
- Website immediately returns to normal

### Best Practices

#### ✅ Do's

- **Plan Ahead**: Schedule maintenance during low-traffic hours
- **Communicate**: Set clear estimated time if known
- **Test First**: Test maintenance page appearance before activating
- **Whitelist**: Add your IP to whitelist for testing
- **Monitor**: Check dashboard remains accessible
- **Update**: Keep visitors informed with accurate messages

#### ❌ Don'ts

- Don't activate without proper planning
- Don't leave maintenance mode on unnecessarily
- Don't forget to remove test IPs from whitelist
- Don't use vague messages ("Be back later")
- Don't activate during peak traffic without warning

### Maintenance Page Design

**Visual Elements**:
- Gradient background (slate-900 via blue-900 to slate-900)
- Animated background blobs (blue and purple)
- Central card with backdrop blur
- Wrench icon with gradient (blue to purple)
- Bounce animation on icon
- Professional typography

**Content Structure**:
```
┌─────────────────────────────────────┐
│     [Animated Wrench Icon]          │
│                                     │
│    Website Under Maintenance        │
│                                     │
│  We are currently performing...     │
│                                     │
│   ⏱ Estimated time: 2 hours         │
│                                     │
│  ─────────────────────────────      │
│                                     │
│   🔄 Please check back later        │
│                                     │
│   📧 Contact: support@example.com   │
│                                     │
│  ─────────────────────────────      │
│                                     │
│      Neverland Studio               │
│   Creative Digital Solutions        │
└─────────────────────────────────────┘
```

---

## ⚡ Real-time Dashboard Features

### Overview

Real-time features provide live data updates without page refresh, enhancing user experience and ensuring administrators have the most current information.

### Consultation Bookings

#### Features

- **Live Updates**: Auto-refresh every 3 seconds
- **LIVE Indicator**: Visual badge showing real-time status
- **Console Logging**: Debug information in browser console
- **Fallback Handling**: Manual fetch if real-time fails
- **Toast Notifications**: Success/error feedback

#### Visual Indicators

**Header Components**:
```
Consultation Bookings
Real-time booking management • Auto-refresh every 3s • Last updated: 10:30:45

[🟢 LIVE]  [Refresh ↻]
```

**LIVE Badge**:
- Green background with border
- Pulsing green dot animation
- "LIVE" text in green
- Only shows when real-time is active

#### Statistics Cards

| Metric | Icon | Description |
|--------|------|-------------|
| Total Bookings | 📅 Calendar | All consultations count |
| Pending | ⏰ Clock | Awaiting action count |
| Scheduled | 📅 Calendar | Confirmed appointments |
| Completed | ✅ CheckCircle | Finished consultations |

#### Implementation Details

**State Management**:
```typescript
const [consultations, setConsultations] = useState<Consultation[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
const [isRealTimeActive, setIsRealTimeActive] = useState(false);
```

**Real-time Subscription**:
```typescript
useEffect(() => {
  console.log('🔄 [Consultations] Component mounted, starting realtime updates...');
  fetchConsultations();
  setIsRealTimeActive(true);
  
  const unsubscribe = realtimeService.subscribe('consultations', (data) => {
    console.log('📡 [Consultations] Realtime update received:', data);
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('✅ [Consultations] Updating with', data.length, 'consultations');
      setConsultations(data);
      setLastUpdate(new Date());
    } else {
      console.log('⚠️ [Consultations] No data in realtime update, fetching manually...');
      fetchConsultations();
    }
  }, 3000); // 3 second interval
  
  return () => {
    console.log('🛑 [Consultations] Component unmounting, stopping realtime updates');
    setIsRealTimeActive(false);
    unsubscribe();
  };
}, []);
```

**Console Output Example**:
```
🔄 [Consultations] Component mounted, starting realtime updates...
✅ Fetched consultations: 5 (5) [Array]
📡 [Consultations] Realtime update received: (5) [Array]
✅ [Consultations] Updating with 5 consultations
📡 [Consultations] Realtime update received: (6) [Array]
✅ [Consultations] Updating with 6 consultations
```

### Course Enrollments

#### Features

Identical implementation to Consultation Bookings:
- ✅ Real-time updates every 3 seconds
- ✅ LIVE indicator badge
- ✅ Console logging for debugging
- ✅ Paginated response handling
- ✅ Fallback mechanisms

#### Statistics Cards

| Metric | Icon | Description |
|--------|------|-------------|
| Total Enrollments | 🎓 GraduationCap | All enrollments count |
| Pending | ⏰ Clock | Awaiting confirmation |
| Confirmed | 🏆 Award | Accepted enrollments |
| Completed | ✅ CheckCircle | Finished courses |

---

## 🔔 Dynamic Badge System

### Overview

Dynamic badge system provides real-time notification counts in the dashboard sidebar for immediate visibility of pending items requiring attention.

### Visual Design

#### Badge Appearance

**Active State** (when selected):
```
[📧 Contacts        (5)]
   │                 │
   │                 └─ Gradient badge with ping animation
   │                    - Blue/cyan gradient background
   │                    - White text
   │                    - Ping dot animation in corner
   └─ Blue/cyan gradient background
```

**Inactive State** (normal):
```
[📧 Contacts        (5)]
   │                 │
   │                 └─ Red/orange gradient badge
   │                    - Animated pulse effect
   │                    - Red border
   │                    - Ping animation dot
   └─ Gray/hover state
```

#### Section Header Badge

**Content Management Section**:
```
📁 CONTENT MANAGEMENT (12) ˅
      │              │
      │              └─ Total count across all items
      │                 - Red/orange gradient
      │                 - Pulse animation
      └─ Section icon
```

### Badge Types

#### Individual Item Badges

| Item | Badge Shows | Update Trigger |
|------|-------------|----------------|
| Contacts | Unread/New messages | New contact submission |
| Enrollments | Pending enrollments | New enrollment or status change |
| Consultations | Pending consultations | New consultation or status change |

#### Section Aggregate Badge

Shows total count of all badges within section:
```
Contacts (5) + Enrollments (3) + Consultations (4) = Content Management (12)
```

### Technical Implementation

#### State Management

```typescript
const [badgeCounts, setBadgeCounts] = useState({
  contacts: 0,
  enrollments: 0,
  consultations: 0
});
```

#### Real-time Updates

```typescript
useEffect(() => {
  const updateBadges = async () => {
    const stats = await realtimeService.getRealtimeStats();
    if (stats) {
      setBadgeCounts({
        contacts: stats.contacts?.unread || stats.contacts?.new || 0,
        enrollments: stats.enrollments?.pending || 0,
        consultations: stats.consultations?.pending || 0
      });
    }
  };

  updateBadges();

  const unsubscribeStats = realtimeService.subscribe('stats', (data) => {
    if (data) {
      setBadgeCounts({
        contacts: data.contacts?.unread || data.contacts?.new || 0,
        enrollments: data.enrollments?.pending || 0,
        consultations: data.consultations?.pending || 0
      });
    }
  });

  return () => unsubscribeStats();
}, []);
```

#### Badge Rendering

```tsx
{item.badge && item.badge > 0 && (
  <span className={`
    relative px-2 py-0.5 rounded-full text-xs font-bold
    ${active
      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
      : isDark
        ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
        : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border border-red-200'
    }
    animate-pulse
  `}>
    {/* Ping animation */}
    <span className="absolute -top-1 -right-1 flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
        active ? 'bg-blue-400' : 'bg-red-400'
      } opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${
        active ? 'bg-blue-500' : 'bg-red-500'
      }`}></span>
    </span>
    {item.badge > 99 ? '99+' : item.badge}
  </span>
)}
```

### Animation Effects

#### Pulse Animation
- **Purpose**: Draw attention to new notifications
- **Duration**: Continuous
- **CSS**: `animate-pulse` (Tailwind)

#### Ping Animation
- **Purpose**: Indicate live/active status
- **Elements**: Two circles (outer ping, inner solid)
- **Duration**: 1s infinite
- **CSS**: `animate-ping` (Tailwind)

#### Gradient Effects
- **Active**: Blue-to-cyan gradient
- **Inactive**: Red-to-orange gradient
- **Shadow**: Matching color shadow for depth

---

## 🔌 Technical Implementation

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Dashboard Components                             │  │
│  │  - Settings.tsx (Maintenance)                     │  │
│  │  - DashboardConsultations.tsx                     │  │
│  │  - DashboardEnrollments.tsx                       │  │
│  │  - DashboardLayout.tsx (Badges)                   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services                                         │  │
│  │  - apiService.ts (HTTP requests)                  │  │
│  │  - realtimeService.ts (Polling)                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
                      HTTP/REST API
                            ↕
┌─────────────────────────────────────────────────────────┐
│                  Backend (Laravel/PHP)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Controllers                                      │  │
│  │  - MaintenanceController.php                      │  │
│  │  - ConsultationsController.php                    │  │
│  │  - EnrollmentsController.php                      │  │
│  │  - DashboardController.php                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Models                                           │  │
│  │  - MaintenanceSettings.php                        │  │
│  │  - Consultation.php                               │  │
│  │  - Enrollment.php                                 │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   Database (MySQL)                       │
│  - maintenance_settings                                  │
│  - consultations                                         │
│  - enrollments                                           │
│  - contacts                                              │
└─────────────────────────────────────────────────────────┘
```

### Real-time Service Architecture

#### Polling Mechanism

```typescript
class RealtimeService {
  private subscribers: Map<string, Set<Function>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  
  subscribe(channel: string, callback: Function, interval: number = 5000) {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel)!.add(callback);
    
    if (!this.intervals.has(channel)) {
      const intervalId = setInterval(() => {
        this.poll(channel);
      }, interval);
      
      this.intervals.set(channel, intervalId);
      this.poll(channel); // Initial poll
    }
    
    return () => this.unsubscribe(channel, callback);
  }
  
  private async poll(channel: string) {
    try {
      const data = await this.fetchData(channel);
      this.notify(channel, data);
    } catch (error) {
      console.error(`Failed to poll ${channel}:`, error);
    }
  }
}
```

### State Management Pattern

```typescript
// Component Pattern
const Component: React.FC<Props> = ({ theme }) => {
  // 1. State declarations
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  
  // 2. Data fetching
  const fetchData = async (showToast = false) => {
    // Fetch logic with error handling
  };
  
  // 3. Real-time subscription
  useEffect(() => {
    fetchData();
    setIsRealTimeActive(true);
    
    const unsubscribe = realtimeService.subscribe('channel', (data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setData(data);
        setLastUpdate(new Date());
      } else {
        fetchData();
      }
    }, 3000);
    
    return () => {
      setIsRealTimeActive(false);
      unsubscribe();
    };
  }, []);
  
  // 4. Render with indicators
  return (
    <div>
      {/* LIVE indicator */}
      {isRealTimeActive && <LiveBadge />}
      {/* Content */}
    </div>
  );
};
```

### Database Migrations

#### Maintenance Settings Table

```php
Schema::create('maintenance_settings', function (Blueprint $table) {
    $table->id();
    $table->boolean('is_active')->default(false);
    $table->string('title')->default('Website Under Maintenance');
    $table->text('message')->nullable();
    $table->string('estimated_time')->nullable();
    $table->json('allowed_ips')->nullable();
    $table->timestamps();
});

// Insert default settings
DB::table('maintenance_settings')->insert([
    'is_active' => false,
    'title' => 'Website Under Maintenance',
    'message' => 'We are currently performing scheduled maintenance. We will be back soon!',
    'estimated_time' => null,
    'allowed_ips' => json_encode([]),
    'created_at' => now(),
    'updated_at' => now(),
]);
```

---

## 📡 API Documentation

### Base URL

```
Production: https://yourdomain.com/api
Development: http://localhost:8000/api
```

### Authentication

Most admin endpoints require authentication. Include token in headers:

```http
Authorization: Bearer {token}
```

### Rate Limiting

- **Public endpoints**: 60 requests/minute
- **Admin endpoints**: 120 requests/minute

### Error Responses

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Server Error |

### Endpoints Summary

#### Maintenance Mode

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/maintenance/status` | No | Check maintenance status |
| GET | `/admin/maintenance` | No* | Get maintenance settings |
| PUT | `/admin/maintenance` | No* | Update maintenance settings |

*Frontend auth handled separately

#### Consultations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/consultations` | No* | List all consultations |
| GET | `/admin/consultations/{id}` | No* | Get consultation details |
| PATCH | `/admin/consultations/{id}/status` | No* | Update consultation status |

#### Enrollments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/enrollments` | No* | List all enrollments |
| GET | `/admin/enrollments/{id}` | No* | Get enrollment details |
| PATCH | `/admin/enrollments/{id}/status` | No* | Update enrollment status |
| DELETE | `/admin/enrollments/{id}` | No* | Delete enrollment |

#### Dashboard Stats

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/overview-stats` | No* | Get dashboard statistics |
| GET | `/dashboard/recent-activities` | No* | Get recent activities |
| GET | `/admin/realtime/stats` | No* | Get real-time statistics |

---

## 🧪 Testing Guide

### Manual Testing

#### Maintenance Mode Testing

**Test Case 1: Activate Maintenance Mode**
1. Login to dashboard
2. Navigate to Settings → Maintenance
3. Toggle maintenance ON
4. Click "Save Maintenance Settings"
5. Open website in incognito mode
6. **Expected**: Should see maintenance page

**Test Case 2: IP Whitelist**
1. While maintenance is ON
2. Add your current IP to whitelist
3. Click "Save Maintenance Settings"
4. Refresh website in normal browser
5. **Expected**: Should access website normally

**Test Case 3: Custom Message**
1. Change maintenance title to "Scheduled Maintenance"
2. Change message to "Back online at 5 PM"
3. Set estimated time to "2 hours"
4. Save settings
5. Check maintenance page
6. **Expected**: Should show custom content

#### Real-time Features Testing

**Test Case 1: Consultation Real-time Updates**
1. Open Dashboard → Consultations
2. Verify "LIVE" badge is visible
3. Open API in another tab: `POST /api/consultations`
4. Submit new consultation
5. Watch dashboard (within 3 seconds)
6. **Expected**: New consultation appears without refresh

**Test Case 2: Badge Updates**
1. Open Dashboard (any page)
2. Note current badge counts in sidebar
3. Create new contact/enrollment/consultation
4. Watch sidebar badges
5. **Expected**: Badges update within 5 seconds

**Test Case 3: Console Logging**
1. Open browser console (F12)
2. Navigate to Dashboard → Consultations
3. Watch console output
4. **Expected**: See logging messages:
   ```
   🔄 [Consultations] Component mounted
   ✅ Fetched consultations: X
   📡 [Consultations] Realtime update received
   ```

### API Testing with cURL

#### Test Maintenance Status

```bash
# Check status
curl -X GET http://localhost:8000/api/maintenance/status

# Expected response
{
  "success": true,
  "is_maintenance": false,
  "data": null
}
```

#### Test Get Maintenance Settings

```bash
curl -X GET http://localhost:8000/api/admin/maintenance

# Expected response
{
  "success": true,
  "data": {
    "id": 1,
    "is_active": false,
    "title": "Website Under Maintenance",
    "message": "We are currently performing...",
    "estimated_time": null,
    "allowed_ips": [],
    "created_at": "2025-12-31T00:00:00.000000Z",
    "updated_at": "2025-12-31T00:00:00.000000Z"
  }
}
```

#### Test Activate Maintenance

```bash
curl -X PUT http://localhost:8000/api/admin/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": true,
    "title": "Scheduled Maintenance",
    "message": "We are performing system updates.",
    "estimated_time": "2 hours",
    "allowed_ips": ["192.168.1.1"]
  }'
```

#### Test Get Consultations

```bash
curl -X GET http://localhost:8000/api/admin/consultations?per_page=1000

# Expected response (paginated)
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "service_type": "Web Development",
        "status": "pending",
        "created_at": "2025-12-31T10:00:00.000000Z"
      }
    ],
    "total": 10,
    "per_page": 1000
  }
}
```

### Browser Testing Matrix

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 120+ | ✅ Tested | All features working |
| Firefox | 121+ | ✅ Tested | All features working |
| Safari | 17+ | ✅ Tested | All features working |
| Edge | 120+ | ✅ Tested | All features working |
| Mobile Chrome | Latest | ✅ Tested | Responsive working |
| Mobile Safari | Latest | ✅ Tested | Responsive working |

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Maintenance Mode Not Activating

**Symptoms**:
- Toggle turns on but website still accessible
- No maintenance page showing

**Solutions**:
1. Check browser cache - Clear cache and hard refresh (Ctrl+Shift+R)
2. Verify API response:
   ```bash
   curl http://localhost:8000/api/maintenance/status
   ```
3. Check console for errors
4. Verify frontend is checking status:
   ```javascript
   // Should see in console every 30 seconds
   "Checking maintenance mode..."
   ```

#### Issue 2: Real-time Updates Not Working

**Symptoms**:
- No "LIVE" badge showing
- Data doesn't update automatically
- Console shows no polling messages

**Solutions**:
1. Open browser console (F12)
2. Look for error messages
3. Verify API endpoints are accessible:
   ```bash
   curl http://localhost:8000/api/admin/consultations
   ```
4. Check realtimeService is running:
   ```javascript
   // Should see in console
   "🔄 [Consultations] Component mounted"
   "📡 [Consultations] Realtime update received"
   ```
5. Verify interval is set to 3000ms (3 seconds)

#### Issue 3: Badges Not Updating

**Symptoms**:
- Badge counts stuck at 0 or old value
- No ping animation

**Solutions**:
1. Check real-time stats endpoint:
   ```bash
   curl http://localhost:8000/api/admin/realtime/stats
   ```
2. Verify subscription in DashboardLayout:
   ```javascript
   // Should see subscribers in console
   realtimeService.subscribe('stats', ...)
   ```
3. Check badge state updates:
   ```javascript
   console.log('Badge counts:', badgeCounts);
   ```

#### Issue 4: IP Whitelist Not Working

**Symptoms**:
- Whitelisted IP still sees maintenance page
- Cannot access website despite being in whitelist

**Solutions**:
1. Verify IP is correctly added:
   ```bash
   curl http://localhost:8000/api/admin/maintenance
   # Check allowed_ips array
   ```
2. Check your actual IP:
   ```bash
   curl https://api.ipify.org
   ```
3. Ensure IP format is correct (IPv4: xxx.xxx.xxx.xxx)
4. Clear browser cache after adding IP
5. Check backend IP detection:
   ```php
   Log::info('Client IP:', ['ip' => $request->ip()]);
   ```

### Debug Mode

#### Enable Frontend Debug Logging

Add to localStorage:
```javascript
localStorage.setItem('debug', 'true');
```

This will show additional console logs for:
- API requests/responses
- Real-time polling activity
- State changes
- Error details

#### Enable Backend Debug Logging

In `.env`:
```
APP_DEBUG=true
LOG_LEVEL=debug
```

Check logs:
```bash
tail -f storage/logs/laravel.log
```

### Performance Issues

#### Issue: Slow Dashboard Loading

**Solutions**:
1. Reduce real-time intervals:
   ```typescript
   // Change from 3000 to 5000 (5 seconds)
   realtimeService.subscribe('consultations', callback, 5000);
   ```
2. Limit data fetching:
   ```typescript
   // Add pagination
   const response = await api.get('/admin/consultations?per_page=50');
   ```
3. Optimize database queries:
   ```php
   // Add indexes to frequently queried columns
   $table->index('status');
   $table->index('created_at');
   ```

#### Issue: High Memory Usage

**Solutions**:
1. Clear old activity logs:
   ```bash
   php artisan activitylog:cleanup --days=30
   ```
2. Optimize real-time service:
   ```typescript
   // Cleanup old subscriptions
   useEffect(() => {
     return () => unsubscribe(); // Always cleanup
   }, []);
   ```

---

## 📊 Monitoring and Logs

### Frontend Logs

**Console Patterns**:
```
✅ Success indicator
❌ Error indicator
📡 Real-time update
🔄 Component lifecycle
⚠️ Warning
🛑 Cleanup/unmount
```

### Backend Logs

**Log Channels**:
```php
// Laravel channels
Log::channel('daily')->info('Message');
Log::channel('maintenance')->info('Maintenance activated');
Log::channel('realtime')->debug('Polling data');
```

**Log Location**:
```
storage/logs/laravel.log
storage/logs/maintenance.log
```

---

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed default data: `php artisan db:seed`
- [ ] Clear caches: `php artisan cache:clear`
- [ ] Build frontend: `npm run build`
- [ ] Test maintenance mode in staging
- [ ] Test real-time features in staging
- [ ] Verify all API endpoints
- [ ] Check database indexes

### Post-deployment

- [ ] Verify maintenance status endpoint
- [ ] Test dashboard access
- [ ] Check real-time polling
- [ ] Verify badge updates
- [ ] Monitor error logs
- [ ] Test from different IPs
- [ ] Clear CDN cache if applicable

---

## 📞 Support

### Getting Help

1. **Check Documentation**: Review this guide first
2. **Console Logs**: Check browser console for errors
3. **Laravel Logs**: Check `storage/logs/laravel.log`
4. **GitHub Issues**: Report bugs with details

### Required Information for Bug Reports

```markdown
**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- PHP Version: 8.2
- Node Version: 20.x

**Issue Description**:
[Describe the issue]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Console Errors**:
[Paste any console errors]

**Screenshots**:
[Attach screenshots if applicable]
```

---

## 📝 Changelog

### Version 2.0.0 (January 1, 2026)

**New Features**:
- ✨ Maintenance Mode System
- ✨ Real-time Consultation Bookings
- ✨ Real-time Course Enrollments
- ✨ Dynamic Badge System
- ✨ LIVE Indicators

**Improvements**:
- 🚀 3-second polling interval for faster updates
- 🎨 Enhanced UI with animations
- 📱 Better mobile responsiveness
- 🐛 Improved error handling

**Technical**:
- 🔧 Migrated to rolldown-vite
- 🔧 Optimized real-time service
- 🔧 Added comprehensive logging
- 🔧 Database optimizations

---

## 📄 License

This documentation is part of the Neverland Studio Portfolio project.

**Copyright © 2025-2026 Neverland Studio. All rights reserved.**

---

*Last updated: January 1, 2026*
*Documentation version: 2.0.0*
*Project version: 1.0.0*
