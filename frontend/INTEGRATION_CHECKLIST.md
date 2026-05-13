# 🤝 Frontend-Backend Integration Checklist

**Use this when you're ready to integrate the frontend with the real backend API.**

---

## ✅ Pre-Integration Phase

### Frontend Team
- [ ] All features tested with mock data
- [ ] UI/UX complete and polished
- [ ] No hardcoded API endpoints (using services)
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Tests passing with mock data
- [ ] Code reviewed and clean
- [ ] Documentation updated

### Backend Team
- [ ] All 44 endpoints from `BACKEND_API_SPECS.md` implemented
- [ ] API running on http://localhost:5178
- [ ] JWT authentication working
- [ ] CORS headers configured for http://localhost:5173
- [ ] Database migrations complete
- [ ] Sample data populated
- [ ] Error responses formatted correctly
- [ ] API documentation generated (Swagger/OpenAPI)

---

## 🔧 Integration Day Steps

### Step 1: Frontend Toggle
**Who:** Frontend developer

1. Open: `src/services/serviceFactory.js`
2. Find Line 12-14:
   ```javascript
   const USE_MOCK_SERVICES = true;  // ← Change to false
   ```
3. Change to:
   ```javascript
   const USE_MOCK_SERVICES = false;
   ```
4. Save file
5. Restart dev server: `npm run dev`

**Verify in Console:**
```
⚙️  Service Mode: 🔌 REAL API
```

### Step 2: Environment Setup
**Who:** Frontend developer

Check `.env` file:
```
VITE_API_BASE_URL=http://localhost:5178
VITE_SOCKET_URL=http://localhost:5178
```

### Step 3: Start Backend
**Who:** Backend developer

```bash
# Your backend startup command
# Should be accessible at http://localhost:5178
```

### Step 4: Basic Test
**Who:** Both teams

1. Frontend dev open browser
2. Navigate to http://localhost:5173
3. Open Network tab (DevTools)
4. Try to sign up
5. Check Network tab for requests to http://localhost:5178

**Expected:** 
- ✅ Network requests showing
- ✅ Status 200/201 or 400 (not 0)
- ✅ JSON responses showing

---

## 🧪 Testing Checklist

### Authentication Tests
- [ ] POST /api/auth/register - Success
- [ ] POST /api/auth/register - Email exists error
- [ ] POST /api/auth/login - Success
- [ ] POST /api/auth/login - Invalid password
- [ ] Token stored in localStorage
- [ ] Token included in all requests
- [ ] Logout clears token

### Event Tests
- [ ] GET /api/event - Shows all events
- [ ] GET /api/event/approved - Shows approved only
- [ ] GET /api/event/search - Search filters work
- [ ] GET /api/event/{id} - Single event details
- [ ] POST /api/event - Organizer can create
- [ ] Events list updates after creation
- [ ] Participant can't access organizer endpoints

### Ticket Tests
- [ ] POST /api/ticket/book - Book ticket success
- [ ] POST /api/ticket/book - Insufficient tickets error
- [ ] GET /api/ticket/participant/{id} - See my tickets
- [ ] GET /api/event/{id}/has-purchased - Check if purchased

### Admin Tests
- [ ] GET /api/admin/pending-accounts - See requests
- [ ] POST /api/admin/accounts/{id}/approve - Approve works
- [ ] POST /api/admin/events/{id}/approve - Event approval works
- [ ] Admin-only routes blocked for other roles

### Error Handling
- [ ] 400 Bad Request - Show message
- [ ] 401 Unauthorized - Redirect to login
- [ ] 403 Forbidden - Show access denied
- [ ] 404 Not Found - Show not found message
- [ ] 500 Server Error - Show error message

---

## 📊 Test Run Script

**Frontend developer runs:**
```bash
npm run test:api
```

**Expected Output:**
```
⚙️  Service Mode: 🔌 REAL API

━━━ Authentication Endpoints ━━━
✓ PASS: POST /api/auth/register - Register new user
✓ PASS: POST /api/auth/login - User login
✓ PASS: POST /api/auth/reset-password - Reset password
✓ PASS: POST /api/auth/logout - User logout

━━━ Event Endpoints ━━━
✓ PASS: GET /api/event - Get all events
✓ PASS: GET /api/event/approved - Get approved events
...

Success Rate: 100%

All tests passed! 🎉
```

**If less than 100%:**
- Note which endpoints are failing
- Backend team debugs those endpoints
- Re-run after fixes

---

## 🔄 Debugging Integration Issues

### Issue: Network shows Status: 0
**Cause:** Backend not responding
**Fix:**
1. Backend team: Check API is running on 5178
2. Frontend: Check `VITE_API_BASE_URL` in `.env`
3. Frontend: Restart dev server
4. Backend: Check logs for errors

### Issue: CORS Error
**Cause:** CORS headers not set
**Fix:**
Backend team add to all endpoints:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Issue: 401 Unauthorized
**Cause:** Token not sent or invalid
**Fix:**
1. Frontend: Check token in localStorage
2. Frontend: Check Authorization header format
3. Backend: Check JWT validation logic

### Issue: Wrong Response Format
**Cause:** Response structure doesn't match spec
**Fix:**
1. Compare response to `BACKEND_API_SPECS.md`
2. Backend team updates response format
3. Frontend may need slight adjustments

### Issue: 404 Not Found
**Cause:** Endpoint not implemented
**Fix:**
1. Check `BACKEND_API_SPECS.md` for endpoint path
2. Backend team implements missing endpoint
3. Re-run tests

---

## 📈 Performance Checks

### Response Times
- [ ] API responds within 1 second normally
- [ ] List endpoints respond within 2 seconds
- [ ] Search is reasonably fast (< 2s)
- [ ] No hanging requests

### Load Handling
- [ ] 10 concurrent users working fine
- [ ] 100 events load without slowdown
- [ ] Large file uploads handled

### Error Recovery
- [ ] Retry logic working
- [ ] Exponential backoff implemented
- [ ] Graceful degradation

---

## 🔐 Security Checklist

### Authentication
- [ ] Passwords are hashed (not stored plain)
- [ ] JWT tokens are validated
- [ ] Tokens expire properly
- [ ] Refresh token mechanism working
- [ ] HTTPS ready (for production)

### Authorization
- [ ] Users can only access own data
- [ ] Admins can access all endpoints
- [ ] Role-based access working
- [ ] No privilege escalation possible

### Data Protection
- [ ] Input validation on all endpoints
- [ ] SQL injection protected
- [ ] XSS protected
- [ ] CSRF tokens (if needed)

---

## 🚀 Production Readiness

### Before Deploying
- [ ] All integration tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] API response times acceptable
- [ ] Error handling complete
- [ ] Logging setup correct
- [ ] Monitoring setup complete

### Configuration
- [ ] Production API URL configured
- [ ] Environment variables set
- [ ] Secrets stored securely
- [ ] Database backups configured
- [ ] CDN configured (if using)

---

## 📝 Sign-Off Checklist

### Frontend Team Lead
- [ ] All features integrated
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- **Signed Off:** _________________ Date: _______

### Backend Team Lead
- [ ] All endpoints implemented
- [ ] API tested independently
- [ ] Database working
- [ ] Monitoring configured
- **Signed Off:** _________________ Date: _______

### Project Manager
- [ ] Feature scope met
- [ ] Performance acceptable
- [ ] Security reviewed
- [ ] Ready for production
- **Approved:** _________________ Date: _______

---

## 📞 Communication Plan

### Daily Standup (During Integration)
- [ ] 15-min sync between frontend & backend leads
- [ ] Discuss blockers
- [ ] Review test results
- [ ] Adjust timeline if needed

### Issue Tracking
- [ ] Use single shared task board (Jira/GitHub Projects)
- [ ] Mark integration issues clearly
- [ ] Link to specific endpoints
- [ ] Assign to responsible team

### Documentation
- [ ] Keep `BACKEND_API_SPECS.md` updated
- [ ] Document any deviations
- [ ] Update endpoint documentation
- [ ] Share integration notes

---

## 🎯 Timeline Example

### Day 1: Preparation
- [ ] Final frontend testing complete
- [ ] Backend final testing complete
- [ ] Documentation reviewed
- [ ] Communication channels ready

### Day 2: Integration Start
- [ ] Frontend toggles mock mode off
- [ ] First test run
- [ ] Identify critical issues
- [ ] Start debugging

### Day 3: Integration Complete
- [ ] All tests passing
- [ ] No critical issues remaining
- [ ] Performance acceptable
- [ ] Ready for review

### Day 4: Final Testing
- [ ] UAT (User Acceptance Testing)
- [ ] Final security review
- [ ] Performance tuning
- [ ] Preparation for production

### Day 5: Production Deployment
- [ ] Deploy to production environment
- [ ] Monitor for issues
- [ ] Gradual rollout (if possible)
- [ ] Ready for users

---

## ✅ Success Criteria

✅ All endpoints accessible and returning correct data  
✅ Authentication/Authorization working  
✅ User workflows complete end-to-end  
✅ Performance acceptable (< 1s response times)  
✅ Error handling graceful  
✅ No browser console errors  
✅ 100% test pass rate  
✅ Code reviewed and approved  
✅ Documentation complete  
✅ Team satisfied with quality  

---

## 🎉 Integration Complete!

When all checkboxes are marked and criteria met, you're ready for production!

---

## 📚 Reference Documents

- `BACKEND_API_SPECS.md` - API specification reference
- `MOCK_REAL_TOGGLE.md` - How to toggle between modes
- `FRONTEND_DEVELOPMENT_STRATEGY.md` - Overall strategy
- `README_DEVELOPMENT.md` - Development setup guide
- `IMPLEMENTATION_COMPLETE.md` - Feature status

---

**Good luck with integration! 🚀**
