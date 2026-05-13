# EventHub Frontend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Backend API running on `http://localhost:5178`
- npm or yarn

### Installation
```bash
cd d:\comfort\ zone\Projects\ 3rd\IA\eventhub
npm install
```

### Environment Setup
Verify `.env` file exists with:
```
VITE_API_BASE_URL=http://localhost:5178
VITE_SOCKET_URL=http://localhost:5178
```

### Start Development Server
```bash
npm run dev
```
Application will be available at `http://localhost:5173`

---

## 🧪 Testing

### Run API Test Suite
```bash
npm run test:api
```

This will test:
- Authentication (Register, Login, Reset Password, Logout)
- Events (CRUD, Search, Get)
- Categories (List, Get by Name)
- Tickets (Book, Query)
- Reviews (Submit, Get)
- Favorites (Add, Get, Remove)

### Manual Testing Workflow

#### 1. Test Registration
1. Click "Sign Up" button
2. Select role: Participant / EventOrganizer / Admin
3. Fill in details:
   - Email: any valid email
   - Password: min 8 chars
   - Name: first and last name
4. Click "Register"
5. Should redirect to home page logged in

#### 2. Test Role-Based Navigation
- **Participant**: See Dashboard, My Tickets, Favorites in menu
- **Organizer**: See My Events, Create Event, Profile in menu
- **Admin**: See Pending Accounts, Pending Events in menu

#### 3. Test Event Browsing
1. Click "Events" in header
2. Events should load from backend
3. Try filters:
   - Search by keyword
   - Filter by category
   - Filter by price range
   - Filter by date range
4. Click on event to view details

#### 4. Test Ticket Booking
1. Click on any event
2. Select a ticket tier
3. Set quantity (use +/- buttons)
4. Click "Confirm Booking"
5. Should see success message or error

#### 5. Test Organizer Create Event
1. Login as EventOrganizer
2. Click "Create Event" in header
3. Fill form:
   - Event title
   - Description
   - Venue
   - Category
   - Date & Time
   - Ticket price
   - Total tickets
   - (Optional) Event image
4. Click "Create Event"
5. Should redirect to My Events

#### 6. Test Admin Features
1. Login as Admin
2. Click "Pending Accounts" or "Pending Events"
3. Should show pending items (if any)
4. Test Approve/Reject buttons

#### 7. Test Protected Routes
- Try accessing organizer routes while logged in as Participant
  - Should redirect to home page
- Try accessing admin routes as non-admin
  - Should redirect to home page

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.jsx (Role-based navigation)
│   ├── ProtectedRoute.jsx (RBAC)
│   └── ... other components
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useEvents.js (Real API)
│   └── useCategories.js (Real API)
├── pages/
│   ├── public/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EventsList.jsx (Real API)
│   │   └── EventDetail.jsx (Real API + Booking)
│   ├── participant/
│   │   ├── Dashboard.jsx
│   │   ├── MyTickets.jsx
│   │   ├── Favorites.jsx
│   │   └── Profile.jsx
│   ├── organizer/
│   │   ├── CreateEvent.jsx (Real Form)
│   │   ├── MyEvents.jsx
│   │   └── Profile.jsx
│   └── admin/
│       ├── PendingAccounts.jsx (New)
│       └── PendingEvents.jsx (New)
├── services/ (NEW)
│   ├── api.js (Axios config)
│   ├── eventService.js
│   ├── ticketService.js
│   ├── categoryService.js
│   ├── reviewService.js
│   ├── favoriteService.js
│   ├── userService.js
│   ├── attachmentService.js
│   └── notificationService.js
└── App.jsx (Protected routes)

tests/
└── api-tests.js (Comprehensive test suite)
```

---

## 🔍 Common Issues & Solutions

### "Cannot find API"
- Verify backend is running on `http://localhost:5178`
- Check `.env` file has correct `VITE_API_BASE_URL`
- Restart dev server after .env changes

### "401 Unauthorized" errors
- Make sure you're logged in
- Token might have expired (logout and login again)
- Check browser localStorage for 'token' key

### "Events not loading"
- Check network tab in browser DevTools
- Verify backend `/api/event/approved` endpoint is working
- Run API test suite to diagnose

### "Booking fails"
- Ensure you're logged in as Participant
- Backend endpoint `/api/ticket/book` must be implemented
- Check network tab for error details

### "Form submission fails"
- Check all required fields are filled
- Verify file uploads if image is included
- Check console for validation errors

---

## 🛠️ Troubleshooting Commands

### Clear Cache & Reinstall
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Check What's Running
```bash
# Check if backend is running
curl http://localhost:5178/api/category

# Check if frontend dev server is running
curl http://localhost:5173
```

### View Network Requests
1. Open Browser DevTools (F12)
2. Go to Network tab
3. Perform action (e.g., login)
4. Look for API calls and responses

### Check localStorage
```javascript
// In browser console:
localStorage.getItem('token')
localStorage.getItem('user')
localStorage.getItem('expiresAtUtc')
```

---

## 📚 API Documentation

All API calls are made through service files in `src/services/`. Example:

```javascript
import { eventService } from '../services/eventService';

// Get approved events
const { data: events } = await eventService.getApprovedEvents();

// Search events
const results = await eventService.searchEvents({ 
  keyword: 'concert',
  venue: 'downtown'
});

// Create event
await eventService.createEvent({
  title: 'My Event',
  description: 'Event description',
  venue: 'Event venue',
  categoryId: 1,
  eventDate: '2024-05-20T19:00:00',
  ticketPrice: 49.99,
  totalTickets: 100,
  image: 'base64 or url'
});

// Book ticket
await ticketService.bookTicket(eventId, participantId, quantity);

// Add to favorites
await favoriteService.addFavorite({
  eventId: 1,
  userId: currentUser.id
});

// Submit review
await reviewService.submitReview({
  eventId: 1,
  participantId: currentUser.id,
  rating: 5,
  text: 'Great event!'
});
```

---

## 📝 Development Tips

### Add New Service
Create file in `src/services/`:
```javascript
import api from './api';

export const myService = {
  getAll: () => api.get('/api/endpoint'),
  getById: (id) => api.get(`/api/endpoint/${id}`),
  create: (data) => api.post('/api/endpoint', data),
  update: (id, data) => api.put(`/api/endpoint/${id}`, data),
  delete: (id) => api.delete(`/api/endpoint/${id}`),
};
```

### Add New Hook
Create file in `src/hooks/`:
```javascript
import { useQuery } from '@tanstack/react-query';
import { myService } from '../services/myService';

export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: () => myService.getAll(),
    select: (response) => response.data,
  });
}
```

### Add New Protected Route
In `App.jsx`:
```javascript
<Route 
  path="/my-page" 
  element={<ProtectedRoute element={<MyPage />} requiredRole="Participant" />} 
/>
```

---

## 🎓 Learning Resources

- React Query: https://tanstack.com/query/latest
- React Router: https://reactrouter.com
- Axios: https://axios-http.com
- Tailwind CSS: https://tailwindcss.com

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Run API tests: `npm run test:api`
3. Check browser DevTools Network tab
4. Review error messages in console
5. Check backend logs
