# 🎯 Frontend Development Strategy: Mock Backend + Real Integration

## Overview

You're a frontend developer and the backend team is building APIs separately. Here's the **professional workflow** to develop independently and integrate later.

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│   Frontend Components               │
│   (React Pages & Hooks)             │
└────────────────┬────────────────────┘
                 │
        ┌────────▼─────────┐
        │ Service Factory  │  ◄─── Toggle here
        └────────┬─────────┘
                 │
         ┌───────┴───────┐
         │               │
    ┌────▼────┐    ┌────▼────┐
    │   MOCK   │    │  REAL   │
    │ Services │    │ Services │
    │ (Now ✅) │    │ (Later) │
    └────┬────┘    └────┬────┘
         │               │
    ┌────▼────┐    ┌────▼────┐
    │Mock Data │    │Actual   │
    │(Instant) │    │ API ✋   │
    └──────────┘    └─────────┘
```

---

## 🚀 Phase 1: Develop with Mock Data (NOW)

### Current Setup

All services are configured to use **mock data** with realistic delays (300-600ms).

### Running with Mock Services

```bash
npm run dev
```

The console will show:
```
⚙️  Service Mode: 🎭 MOCK
```

### What You Can Do Now

✅ Sign up with different roles  
✅ Browse and search events  
✅ Book tickets  
✅ Create events  
✅ Leave reviews  
✅ Add favorites  
✅ Admin approvals  
✅ Test ALL workflows  

**Everything works without the backend!**

---

## 📋 Phase 2: Define API Contracts (Document for Backend Team)

Share these files with your backend team so they know exactly what to build:

### API Request/Response Contracts

Create file: **BACKEND_API_SPECS.md**

```markdown
# EventHub Backend API Specifications

## Authentication

### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "applyAs": "Participant" | "EventOrganizer" | "Admin"
}
```

**Response:** (201)
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "applyAs": "Participant"
  },
  "token": "jwt_token_here",
  "expiresAtUtc": "2026-05-03T12:00:00Z"
}
```

---

## 🔄 Phase 3: Integration (When Backend Ready)

### Step 1: Stop Development
```bash
# Ctrl+C to stop dev server
```

### Step 2: Update Service Factory

In **src/services/serviceFactory.js**, change:

```javascript
// FROM:
const USE_MOCK_SERVICES = true;  // 👈 Using mock

// TO:
const USE_MOCK_SERVICES = false;  // 👈 Using real API
```

### Step 3: Restart Development Server

```bash
npm run dev
```

Console will show:
```
⚙️  Service Mode: 🔌 REAL API
```

### Step 4: Test Everything

All the same tests you did with mock data will now use the **real backend API**.

```bash
npm run test:api
```

---

## 📁 File Structure

```
src/services/
├── api.js                    # Axios configuration with interceptors
├── serviceFactory.js         # 👈 TOGGLE HERE (mock vs real)
├── mockData.js              # All mock data (events, users, tickets, etc)
├── mockServices.js          # Mock implementations (300-600ms delay)
├── realServices.js          # Real API implementations (waiting for backend)
├── eventService.js          # Re-exports from factory
├── ticketService.js         # Re-exports from factory
├── categoryService.js       # Re-exports from factory
├── favoriteService.js       # Re-exports from factory
├── reviewService.js         # Re-exports from factory
└── userService.js           # Re-exports from factory
```

---

## 🎯 Current Mock Features (All Working!)

### Events
- ✅ Get all/approved/pending events
- ✅ Search events with filters
- ✅ Get single event details
- ✅ Create event (for organizers)
- ✅ Update/Delete events
- ✅ Get event analytics

### Tickets
- ✅ Book tickets
- ✅ Get participant tickets
- ✅ Check if user purchased event
- ✅ Get tickets for event

### Categories
- ✅ Get all categories
- ✅ Search by name/id
- ✅ Create/Update/Delete categories

### Reviews
- ✅ Submit review
- ✅ Get event reviews
- ✅ Delete review

### Favorites
- ✅ Add to favorites
- ✅ Get user favorites
- ✅ Remove favorite

### Users
- ✅ Get user profile
- ✅ Update profile
- ✅ Reset password

### Admin
- ✅ Get pending accounts
- ✅ Get pending events
- ✅ Approve/Reject accounts & events

---

## 🧪 Testing Workflow

### Test with Mock Data (NOW)
1. Start dev server: `npm run dev`
2. Sign up as different roles
3. Test all workflows
4. Everything works instantly ✅

### Test with Real API (LATER)
1. Backend team starts their server
2. Change `USE_MOCK_SERVICES = false`
3. Restart dev server: `npm run dev`
4. Run tests: `npm run test:api`
5. Same tests, but now hitting real endpoints

---

## 💻 For Your Backend Team

### What They Need to Build

**51 API Endpoints across 8 categories:**

1. **Authentication (4)**
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/reset-password
   - POST /api/auth/logout

2. **Events (9)**
   - GET /api/event (all)
   - GET /api/event/approved
   - GET /api/event/pending
   - GET /api/event/upcoming
   - GET /api/event/search
   - GET /api/event/{id}
   - GET /api/event/{id}/analytics
   - POST /api/event (create)
   - PUT /api/event/{id} (update)
   - DELETE /api/event/{id} (delete)

3. **Categories (7)**
   - GET /api/category
   - GET /api/category/{id}
   - GET /api/category/with-counts
   - GET /api/category/name/{name}
   - POST /api/category
   - PUT /api/category/{id}
   - DELETE /api/category/{id}

4. **Tickets (6)**
   - POST /api/ticket/book
   - GET /api/ticket/participant/{id}
   - GET /api/ticket/participant/{id}/has-purchased/{eventId}
   - GET /api/ticket/event/{eventId}
   - GET /api/ticket/{id}
   - GET /api/ticket/qr/{qrCode}

5. **Reviews (3)**
   - POST /api/review
   - GET /api/review/event/{eventId}
   - DELETE /api/review/{id}

6. **Favorites (3)**
   - POST /api/favorite
   - GET /api/favorite/user/{userId}
   - DELETE /api/favorite/{id}

7. **Users (5)**
   - GET /api/user/{id}
   - GET /api/user/email/{email}
   - GET /api/user/check-email/{email}
   - PUT /api/user/{id}
   - DELETE /api/user/{id}

8. **Admin (14)**
   - GET /api/admin/pending-accounts
   - GET /api/admin/pending-events
   - POST /api/admin/accounts/{id}/approve
   - POST /api/admin/accounts/{id}/reject
   - POST /api/admin/events/{id}/approve
   - POST /api/admin/events/{id}/reject
   - ... (and more)

---

## 🔧 Customizing Mock Data

### Edit Mock Events

**File:** `src/services/mockData.js`

```javascript
export const mockEvents = [
  {
    id: 1,
    title: 'Your Event Title',
    description: 'Event description',
    venue: 'Event venue',
    categoryId: 1,
    eventDate: new Date(...).toISOString(),
    ticketPrice: 99.99,
    totalTickets: 500,
    // ... more fields
  },
];
```

### Add More Mock Data

Same file - modify `mockCategories`, `mockUsers`, `mockTickets`, etc.

### Add Realistic Delays

In `mockServices.js`, each method calls `await delay(ms)`:

```javascript
async getApprovedEvents() {
  await delay(400);  // 400ms delay
  return { data: mockEvents };
}
```

---

## 🎓 Development Tips

### 1. Debug Mock Services

Open browser DevTools → Network tab. You'll see no network requests (running locally in JS).

### 2. Check Response Format

In browser console:
```javascript
import { eventService } from './services/eventService';
const events = await eventService.getApprovedEvents();
console.log(events.data);
```

### 3. Add Logging to Mock Services

In `mockServices.js`:
```javascript
async getApprovedEvents() {
  console.log('📦 Mock: Fetching approved events...');
  await delay(400);
  console.log('✅ Mock: Returning', mockEvents.length, 'events');
  return { data: mockEvents };
}
```

### 4. Test Error Scenarios

In mock services, throw errors to test error handling:
```javascript
if (!event) {
  throw { status: 404, data: { message: 'Event not found' } };
}
```

---

## 📞 Integration Checklist

When backend is ready, check all these:

- [ ] Backend API running on http://localhost:5178
- [ ] All 51 endpoints implemented
- [ ] Response formats match mock data structure
- [ ] Bearer token authentication working
- [ ] CORS headers configured
- [ ] Changed `USE_MOCK_SERVICES = false`
- [ ] Frontend dev server restarted
- [ ] Run `npm run test:api` - all tests pass
- [ ] Manual testing: Sign up, Browse, Book, Create, Admin features
- [ ] Error handling working (404, 500, validation errors)
- [ ] Performance acceptable (under 1s per request)

---

## 🎬 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Start dev server with mock data
npm run dev

# 3. Run tests (with mock data)
npm run test:api

# 4. Build for production
npm run build

# 5. (Later) Switch to real API
# Edit src/services/serviceFactory.js
# Change: USE_MOCK_SERVICES = false
# npm run dev
```

---

## 🚨 Troubleshooting

### "Service Mode: MOCK" but API calls failing
- Check network tab - there should be NO network requests
- If there are network requests, USE_MOCK_SERVICES is false
- Restart dev server after changes

### Mock data not updating
- Modify `src/services/mockData.js`
- Changes take effect on refresh (webpack hot reload)
- Hard refresh: Ctrl+Shift+R

### Ready to test real API but backend not ready
- Keep `USE_MOCK_SERVICES = true`
- Finish all frontend features
- Backend team can work independently

### Need to test specific error scenario
- Modify `mockServices.js` to throw error
- Test error handling UI
- Change back when done

---

## 📚 Files to Share with Backend Team

1. **API Specifications** (create this)
   - All 51 endpoints
   - Request/Response formats
   - Error codes and messages

2. **Mock Data** (`src/services/mockData.js`)
   - Show backend team the data structure
   - They should match this format

3. **Real Services** (`src/services/realServices.js`)
   - Shows exact API endpoints expected
   - Backend team implements these endpoints

---

## ✨ Benefits of This Approach

1. **No blocking** - Frontend development doesn't wait for backend
2. **Parallel work** - Frontend & Backend teams work independently
3. **Easy integration** - Single line toggle when backend ready
4. **Same tests** - Mock and real use identical test suite
5. **Documentation** - Mock data serves as API documentation
6. **Quality** - Catch UI issues before backend is ready
7. **Professional** - Industry-standard development pattern

---

## 🎯 Next Steps

1. **Today** - Develop all frontend features with mock data ✅
2. **Share** - Give backend team the API specs (endpoints, request/response)
3. **Parallel** - While backend builds APIs, you can test UI/UX, add more features
4. **Ready** - When backend API ready, change `USE_MOCK_SERVICES = false`
5. **Integrate** - Toggle and test with real backend
6. **Done** - Ship production code

---

**You're all set! Start developing with mock data and integrate later. 🚀**
