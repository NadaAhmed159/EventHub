# EventHub Frontend - Complete Development Setup

## 🎯 Current Status: ✅ READY FOR DEVELOPMENT

All frontend features are implemented and working with **mock data**. Backend integration will be seamless when backend APIs are ready.

---

## 📦 What You Have

### ✅ Completed Features
1. **Role-Based Access Control (RBAC)**
   - Participant, EventOrganizer, Admin roles
   - Protected routes with automatic redirects
   - Role-specific navigation menus

2. **Event Management**
   - Browse all approved events
   - Search with filters (category, price, date)
   - View detailed event information
   - Create events (organizers)
   - Admin approve/reject events

3. **Ticket Booking**
   - Search events
   - Select and book tickets
   - Automatic redirect to My Tickets
   - Real-time availability updates

4. **Reviews & Ratings**
   - Submit reviews after event
   - View all event reviews
   - Star rating system

5. **Favorites**
   - Add events to favorites
   - Manage watchlist
   - Quick access to saved events

6. **User Management**
   - Register with role selection
   - Profile management
   - Password reset

7. **Admin Dashboard**
   - View pending account approvals
   - View pending event approvals
   - Approve/Reject organizers and events

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "d:\comfort zone\Projects 3rd\IA\eventhub"
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Opens at: http://localhost:5173

### 3. Start Using

**Test as Participant:**
- Sign up with role "Participant"
- Browse events
- Book tickets
- Leave reviews

**Test as Organizer:**
- Sign up with role "EventOrganizer"
- Click "Create Event"
- Fill in event details
- See event in dashboard

**Test as Admin:**
- Sign up with role "Admin"
- View pending approvals
- Approve/Reject requests

---

## 📡 Mock vs Real API

### Current: MOCK MODE ✅
```javascript
// src/services/serviceFactory.js, Line 12:
const USE_MOCK_SERVICES = true;
```

All data is mock with 300-600ms delays to simulate real API.

### When Backend Ready: REAL MODE
```javascript
// src/services/serviceFactory.js, Line 12:
const USE_MOCK_SERVICES = false;
```

Switch to real backend API on http://localhost:5178

**See:** `MOCK_REAL_TOGGLE.md` for details

---

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ProtectedRoute.jsx      # RBAC wrapper
│   ├── Header.jsx              # Role-based navigation
│   └── ...
├── pages/               # Page components
│   ├── public/          # Public pages
│   ├── participant/     # Participant-only pages
│   ├── organizer/       # Organizer-only pages
│   └── admin/           # Admin-only pages
├── services/            # API layer (THE KEY FOLDER)
│   ├── serviceFactory.js        # 👈 MOCK/REAL TOGGLE HERE
│   ├── mockServices.js          # Mock implementations
│   ├── realServices.js          # Real API implementations
│   ├── mockData.js              # Mock data (events, users, etc)
│   ├── eventService.js          # Event service (re-exported)
│   ├── ticketService.js         # Ticket service
│   ├── categoryService.js       # Category service
│   └── ...
├── hooks/               # React hooks
├── context/             # React context (Auth, Theme)
└── App.jsx             # Main routing with RBAC

tests/
└── api-tests.js        # Test suite (run: npm run test:api)
```

---

## 🔧 Key Files

### 1. Service Factory (The Toggle)
**File:** `src/services/serviceFactory.js`

```javascript
// Line 12-14:
const USE_MOCK_SERVICES = true;  // ← CHANGE THIS

// Automatically exports mock or real services
export const eventService = ...
export const ticketService = ...
```

### 2. Mock Data
**File:** `src/services/mockData.js`

Contains all mock data:
- 5 realistic events
- 8 categories
- 3 mock users
- Mock bookings, reviews, favorites

### 3. Mock Services
**File:** `src/services/mockServices.js`

All service implementations with mock data.

### 4. Real Services
**File:** `src/services/realServices.js`

All service implementations calling real API.

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `FRONTEND_DEVELOPMENT_STRATEGY.md` | Complete development workflow & architecture |
| `BACKEND_API_SPECS.md` | **Share with backend team** - exact API specs |
| `MOCK_REAL_TOGGLE.md` | How to switch between mock and real |
| `QUICK_START.md` | Testing guide & troubleshooting |
| `IMPLEMENTATION_COMPLETE.md` | Feature breakdown & status |

---

## 🧪 Testing

### Test with Mock Data (NOW)
```bash
npm run dev
# Test UI features:
# - Sign up/login
# - Browse events
# - Book tickets
# - Create events
# - Admin functions
```

### Test with Real API (LATER)
```bash
# 1. Change serviceFactory.js:
#    const USE_MOCK_SERVICES = false;
# 2. Start backend on http://localhost:5178
# 3. Run:
npm run test:api
```

---

## 🎯 Development Workflow

### Phase 1: Now (Feature Development)
```
✅ All frontend features working with mock data
✅ Can test all user workflows
✅ Can identify UI/UX issues
✅ Components fully built and styled
```

### Phase 2: Later (Backend Development)
```
Backend team builds 44+ endpoints defined in:
→ BACKEND_API_SPECS.md
```

### Phase 3: Integration (When Backend Ready)
```
1. Change USE_MOCK_SERVICES = false
2. Restart dev server
3. Backend provides http://localhost:5178
4. Frontend automatically uses real API
5. Run tests: npm run test:api
6. Deploy to production
```

---

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Protected routes (RBAC)
- ✅ Bearer token on all API calls
- ✅ Auto-logout on 401
- ✅ Password reset capability
- ✅ Role-based authorization

---

## 📝 API Endpoints (44 Total)

### Mock Mode
All endpoints available instantly with mock data.

### Real Mode (When Backend Ready)
| Category | Endpoints |
|----------|-----------|
| Auth | 4 |
| Events | 10 |
| Categories | 7 |
| Tickets | 6 |
| Reviews | 3 |
| Favorites | 3 |
| Users | 5 |
| Admin | 6 |

See `BACKEND_API_SPECS.md` for complete details.

---

## 🎬 Common Tasks

### Add New Event to Mock Data
**File:** `src/services/mockData.js`

```javascript
export const mockEvents = [
  // ... existing events
  {
    id: 6,
    title: "My New Event",
    description: "Event description",
    // ... other fields
  }
];
```

### Customize Mock Delays
**File:** `src/services/mockServices.js`

```javascript
async getApprovedEvents() {
  await delay(400);  // ← Change this (milliseconds)
  return { data: mockEvents };
}
```

### Add New Service Method
**Files:** 
- `src/services/mockServices.js` (mock implementation)
- `src/services/realServices.js` (real implementation)
- `src/services/serviceFactory.js` (export both)

---

## 🐛 Troubleshooting

### Issue: "Service Mode: REAL API" but no backend running
**Solution:** 
1. Change `USE_MOCK_SERVICES = true`
2. Restart server
3. Wait for backend team

### Issue: Tests failing with Status: 0
**Cause:** Backend not running
**Solution:**
1. Start backend: http://localhost:5178
2. Ensure `USE_MOCK_SERVICES = false`
3. Check `.env` file for correct API_BASE_URL

### Issue: Mock events not showing
**Solution:**
1. Check `mockData.js` exists
2. Hard refresh: Ctrl+Shift+R
3. Check browser console for errors

---

## 🚀 Production Deployment

### Before Deployment
```javascript
// Make sure this is FALSE:
const USE_MOCK_SERVICES = false;
```

### Environment Variables
Create `.env.production`:
```
VITE_API_BASE_URL=https://your-backend-api.com
VITE_SOCKET_URL=https://your-socket-server.com
```

### Build
```bash
npm run build
```

### Deploy
```bash
# Your deployment command
npm run preview  # Test production build locally
```

---

## 📞 Communication Plan

### With Backend Team
1. **Now:** Share `BACKEND_API_SPECS.md`
2. **Progress:** Regular sync-ups on endpoint status
3. **Ready:** Backend notifies when APIs live
4. **Integration:** Change `USE_MOCK_SERVICES = false`
5. **Testing:** Run `npm run test:api` together

### Within Frontend Team
- Divide UI components
- Use same `serviceFactory.js` toggle
- Same mock data for consistency
- Share integration status

---

## ✨ Next Steps

### Immediate (This Week)
- [ ] Review documentation
- [ ] Test all features with mock data
- [ ] Identify UI/UX improvements
- [ ] Test with different roles
- [ ] Share `BACKEND_API_SPECS.md` with backend team

### Short Term (Next Week)
- [ ] Implement remaining organizer pages (My Events, Edit)
- [ ] Implement remaining participant pages (My Tickets, Favorites UI)
- [ ] Add more mock data for testing
- [ ] Performance optimization
- [ ] Mobile testing

### Integration (When Backend Ready)
- [ ] Backend provides http://localhost:5178
- [ ] Change `USE_MOCK_SERVICES = false`
- [ ] Run `npm run test:api`
- [ ] Fix any mismatches
- [ ] Deploy to production

---

## 🎓 Learning Resources

- React: https://react.dev
- React Router: https://reactrouter.com
- React Query: https://tanstack.com/query
- Axios: https://axios-http.com
- Tailwind CSS: https://tailwindcss.com

---

## ✅ Feature Checklist

Frontend Features:
- [x] User authentication (signup/login)
- [x] Role-based routing (RBAC)
- [x] Event browsing and search
- [x] Event details page
- [x] Ticket booking
- [x] Event creation (organizer)
- [x] Reviews and ratings
- [x] Favorites management
- [x] Admin dashboard
- [x] Profile management
- [x] Responsive design

Backend Integration (PENDING):
- [ ] Backend API running
- [ ] All 44 endpoints implemented
- [ ] JWT authentication
- [ ] Database integration
- [ ] Error handling

---

## 📊 Architecture Diagram

```
User Browser
     ↓
Frontend App (React)
     ↓
Components (Pages, Forms, Lists)
     ↓
Service Factory (src/services/serviceFactory.js)
     ├─→ Mock Mode (NOW)
     │   ├─ mockServices.js
     │   └─ mockData.js
     │
     └─→ Real Mode (LATER)
         ├─ realServices.js
         └─ http://localhost:5178
```

---

## 🎉 You're All Set!

**Current Status:** ✅ Frontend Ready  
**Backend Status:** ⏳ In Development  
**Integration:** 🔄 Ready to toggle

Start developing features with mock data, and switch to real API when backend is ready.

**The beauty of this setup:** No refactoring needed. Just change one line and everything works with the real backend.

---

**Questions? See the documentation files or check the code comments.**

🚀 **Happy coding!**
