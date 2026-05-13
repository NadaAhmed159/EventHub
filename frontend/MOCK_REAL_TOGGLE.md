# How to Toggle Between Mock & Real API

## 🎭 MOCK MODE (Frontend Development - NOW)

### Current Status: ✅ USING MOCK
All features are working with realistic mock data.

### To Use Mock Data:
**File:** `src/services/serviceFactory.js`

**Line 12-14:**
```javascript
const USE_MOCK_SERVICES = true;  // 👈 SET TO TRUE
```

### What You Get:
- ✅ 5 realistic events
- ✅ Multiple categories
- ✅ Mock users (participant, organizer, admin)
- ✅ Mock bookings, reviews, favorites
- ✅ 300-600ms simulated delays
- ✅ All features working
- ✅ No backend needed

### Run:
```bash
npm run dev
```

**Console output:**
```
⚙️  Service Mode: 🎭 MOCK
```

---

## 🔌 REAL API MODE (Backend Ready - LATER)

### When Backend is Ready:
1. Backend team completes all endpoints from `BACKEND_API_SPECS.md`
2. Backend API running on http://localhost:5178
3. Make ONE change:

### To Switch to Real API:
**File:** `src/services/serviceFactory.js`

**Line 12-14:**
```javascript
const USE_MOCK_SERVICES = false;  // 👈 CHANGE TO FALSE
```

### Then:
```bash
npm run dev
```

**Console output:**
```
⚙️  Service Mode: 🔌 REAL API
```

---

## 📋 What Changed Under the Hood

### Mock Mode Flow:
```
Component → eventService.js
         ↓
    serviceFactory.js (USE_MOCK_SERVICES = true)
         ↓
    mockServices.js (instant + delay)
         ↓
    mockData.js
```

### Real Mode Flow:
```
Component → eventService.js
         ↓
    serviceFactory.js (USE_MOCK_SERVICES = false)
         ↓
    realServices.js
         ↓
    api.js (Axios) → http://localhost:5178
```

---

## ⚡ The Single Line Toggle

**That's it. ONE line changes everything.**

```javascript
// BEFORE (Mock - Frontend development)
const USE_MOCK_SERVICES = true;

// AFTER (Real API - Backend ready)
const USE_MOCK_SERVICES = false;
```

---

## 🧪 Testing Both Modes

### Test Mock Mode:
```bash
# Keep USE_MOCK_SERVICES = true
npm run dev
npm run test:api    # Shows 0% (mock services aren't HTTP)
```

### Test Real Mode:
```bash
# 1. Change to: USE_MOCK_SERVICES = false
# 2. Start backend on http://localhost:5178
# 3. Restart frontend: npm run dev
npm run test:api    # Shows success rate if all endpoints working
```

---

## 🔄 Switching Back & Forth

You can switch anytime:

```
Developing UI?          → USE_MOCK_SERVICES = true
Testing with backend?   → USE_MOCK_SERVICES = false
Backend broken?         → USE_MOCK_SERVICES = true (keep developing)
Backend fixed?          → USE_MOCK_SERVICES = false (integrate)
```

**No other code changes needed.**

---

## ✅ Verification Checklist

### When Mode is MOCK:
- [ ] Console shows "🎭 MOCK"
- [ ] No network requests in DevTools
- [ ] All features working instantly
- [ ] Can sign up/login without backend
- [ ] Can book tickets instantly
- [ ] Can create events instantly

### When Mode is REAL:
- [ ] Console shows "🔌 REAL API"
- [ ] Network requests in DevTools → http://localhost:5178
- [ ] Features work if backend responding
- [ ] 401 errors if token expires
- [ ] 404 errors if backend endpoint missing
- [ ] Run `npm run test:api` for validation

---

## 🚀 Full Development Workflow

### Step 1: Mock Development (NOW)
```javascript
// src/services/serviceFactory.js
const USE_MOCK_SERVICES = true;
```
```bash
npm run dev
# Build all features ✅
```

### Step 2: Share Specs with Backend
Send them:
- `BACKEND_API_SPECS.md` (what endpoints to build)
- `mockData.js` (example data structure)

### Step 3: Backend Development
Backend team builds 44+ endpoints independently.

### Step 4: Integration (When Backend Ready)
```javascript
// src/services/serviceFactory.js
const USE_MOCK_SERVICES = false;  // ← Change this
```
```bash
npm run dev
# Same UI, now using real backend
npm run test:api
# Validates all endpoints working
```

---

## 🐛 Troubleshooting

### "Mode is MOCK but getting network errors"
1. Check `serviceFactory.js` line 12
2. Make sure `USE_MOCK_SERVICES = true`
3. Restart dev server
4. Hard refresh: Ctrl+Shift+R

### "Mode is REAL but no network requests"
1. Check `serviceFactory.js` line 12
2. Make sure `USE_MOCK_SERVICES = false`
3. Restart dev server
4. Check Network tab in DevTools
5. Should see requests to `http://localhost:5178`

### "Tests show 0% success with MOCK"
That's OK! Mock services use in-memory responses, not HTTP.
```bash
# This test framework expects HTTP responses
npm run test:api   # Shows Status: 0 (no HTTP)
```

### "Tests show 0% success with REAL"
1. Backend not running? Start it.
2. Wrong port? Check `.env` file
3. Endpoints not implemented? Backend team needs to add them
4. Check backend logs for errors

---

## 📊 Service Architecture

### File: `src/services/serviceFactory.js`
```javascript
// ============================================
// TOGGLE THIS TO SWITCH BETWEEN MOCK & REAL
// ============================================
const USE_MOCK_SERVICES = true;  // ← CHANGE THIS

// OR read from environment variable
const ENV_MODE = import.meta.env.VITE_USE_MOCK_SERVICES ?? 'true';
const shouldUseMock = USE_MOCK_SERVICES || ENV_MODE === 'true';

// Export the appropriate services
export const eventService = shouldUseMock 
  ? mockServices.eventService 
  : realServices.eventService;
```

### File: `src/services/mockServices.js`
All services with mock implementations (instant + delays).

### File: `src/services/realServices.js`
All services calling actual HTTP endpoints.

---

## Environment Variable Alternative

Instead of editing code, you can use environment variable:

**File:** `.env.local`
```
VITE_USE_MOCK_SERVICES=false
```

**Then:**
```bash
npm run dev
```

Service factory checks both:
1. `USE_MOCK_SERVICES` constant (priority)
2. `VITE_USE_MOCK_SERVICES` env var (fallback)

---

## 🎓 How It Works (Technical)

Each service has same interface in both mock and real:

```javascript
// Both do the same thing, different implementation
await eventService.getApprovedEvents()

// Mock version: Returns mock data instantly + 400ms delay
// Real version: Makes HTTP GET to /api/event/approved
```

When you toggle `USE_MOCK_SERVICES`:
- All components stay the same (import from serviceFactory)
- Only the underlying implementation changes
- No component code modifications needed
- Same data structure guaranteed
- Tests work identically

---

## ✨ Benefits

✅ **Frontend works without backend**  
✅ **Parallel development teams**  
✅ **Easy switching (1 line)**  
✅ **Same tests for both modes**  
✅ **Mock data matches real structure**  
✅ **No code duplication**  
✅ **Production ready**  

---

## 🚀 TL;DR

**Mock Mode (Development):**
```javascript
// src/services/serviceFactory.js
const USE_MOCK_SERVICES = true;  // ← This
npm run dev                        // Works instantly
```

**Real Mode (Backend Ready):**
```javascript
// src/services/serviceFactory.js
const USE_MOCK_SERVICES = false;  // ← Change to this
npm run dev                        // Uses real backend
```

**That's literally it.**
