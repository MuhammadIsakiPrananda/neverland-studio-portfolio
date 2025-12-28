# Real-time Analytics Dashboard

## Overview
The Analytics Dashboard (`/dashboard/analytics`) now features real-time data updates using a polling-based system that automatically refreshes statistics and activities every 5 seconds.

## Features

### 1. **Real-time Statistics Updates**
- Automatic updates every 5 seconds
- Live connection status indicator (Connected/Connecting/Disconnected)
- Visual feedback with animated indicators

### 2. **Toggle Real-time Mode**
- Switch between **Real-time** and **Manual** refresh modes
- Real-time mode shows countdown timer (updates every 5 seconds)
- Manual mode allows user-triggered refresh only

### 3. **Connection Status**
- **Connected** (Green): Real-time data is flowing
- **Connecting** (Yellow): Attempting to establish connection
- **Disconnected** (Red): No active connection

### 4. **Live Data Subscriptions**
The following data is updated in real-time:
- **Users Statistics**: Total, Today
- **Contacts**: Total, New, Today
- **Enrollments**: Total, Pending, Approved, Today
- **Consultations**: Total, Pending, Scheduled, Today
- **Newsletters**: Total, Today
- **Logins**: Total, Today, Failed Today
- **Recent Activities**: Last 10 activities

### 5. **Chart Data**
Chart data (Line, Bar, Pie) is refreshed every 30 seconds to show trends and distributions.

## Technical Implementation

### Frontend Components

#### RealtimeService Integration
```typescript
// Subscribe to real-time stats
realtimeService.subscribe(
  'stats',
  (realtimeStats: RealtimeStats) => {
    // Process and update stats
  },
  5000 // Poll every 5 seconds
);

// Subscribe to activity logs
realtimeService.subscribe(
  'activity-logs',
  (data) => {
    // Process and update activities
  },
  5000
);
```

#### Connection Status Monitoring
```typescript
// Subscribe to connection status changes
realtimeService.subscribeToStatus((status) => {
  setConnectionStatus(status);
});
```

### Backend Endpoints

#### Real-time Stats Endpoint
```
GET /api/admin/realtime/stats
```

Returns comprehensive statistics including:
- User counts (total, today, online)
- Contact messages (total, new, unread, today)
- Enrollment data (total, pending, approved, today)
- Consultation info (total, pending, scheduled, today)
- Newsletter subscribers (total, today)
- Login statistics (total, today, failed_today)

#### Activity Logs Endpoint
```
GET /api/admin/activity-logs/recent?limit=10
```

Returns the most recent 10 activity logs across all modules.

## User Interface

### Control Buttons

1. **Real-time Toggle Button**
   - Green when active with pulsing radio icon
   - Gray when disabled
   - Shows countdown timer in real-time mode

2. **Time Range Selector**
   - Last 7 days
   - Last 14 days
   - Last 30 days
   - Affects chart data display

3. **Manual Refresh Button**
   - Forces immediate data refresh
   - Available in both modes
   - Shows spinning icon during refresh

### Status Indicators

#### Connection Status Badge
- Positioned next to the page title
- Color-coded indicator (green/yellow/red)
- Animated icons for visual feedback

#### Statistics Cards
All cards update in real-time:
- Users (with today/week counts)
- Contacts (with new badge)
- Enrollments (with pending badge)
- Consultations (with scheduled badge)
- Newsletters
- Logins (with failed attempts badge)

#### Activity Timeline
- Shows last 10 activities in real-time
- Each activity shows:
  - Type icon (Contact, Enrollment, Consultation, Newsletter)
  - Title and description
  - Timestamp (relative time: "2m ago", "1h ago")
  - Status badge (New, Pending, Approved, Scheduled)

## Benefits

1. **No Manual Refresh Needed**: Data updates automatically
2. **Better User Experience**: Always showing current data
3. **Resource Efficient**: Polling interval optimized at 5 seconds
4. **Flexible Control**: Users can switch modes based on preference
5. **Visual Feedback**: Clear indicators of connection and update status

## Performance Considerations

- Polling interval: 5 seconds (statistics & activities)
- Chart data refresh: 30 seconds
- Automatic cleanup on component unmount
- Efficient subscription management
- Connection status monitoring prevents unnecessary requests

## Future Enhancements

Potential improvements:
1. WebSocket support for true push-based real-time updates
2. Configurable polling intervals
3. Data caching and offline support
4. Real-time notifications for critical events
5. Historical playback of statistics

## Usage

To use the real-time analytics dashboard:

1. Navigate to `/dashboard/analytics`
2. The real-time mode is **ON by default**
3. Observe the connection status indicator
4. Stats will auto-update every 5 seconds
5. Toggle real-time mode ON/OFF as needed
6. Use manual refresh button for immediate updates
7. Adjust time range for chart visualization

## Troubleshooting

### Connection Issues
- Check if backend server is running
- Verify CORS settings allow polling
- Check browser console for errors
- Ensure authentication is valid

### Data Not Updating
- Verify connection status is "Connected"
- Check if real-time mode is enabled
- Try manual refresh button
- Inspect network requests in browser DevTools

### Performance Issues
- Consider increasing polling interval
- Check network latency
- Verify backend response times
- Monitor browser memory usage

## API Requirements

Ensure the following endpoints are available:

1. `/api/admin/realtime/stats` - Real-time statistics
2. `/api/admin/activity-logs/recent` - Recent activities
3. `/api/dashboard/chart-data` - Chart data for trends

All endpoints require authentication via cookies/sessions.
