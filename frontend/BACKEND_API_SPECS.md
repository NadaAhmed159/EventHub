# EventHub Backend API Specifications

**For Backend Development Team**

This document defines the exact API endpoints, request/response formats, and expected behaviors for the EventHub backend.

**Frontend is ready to integrate as soon as these endpoints are available.**

---

## 🔐 Authentication

### 1. POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
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
    "applyAs": "Participant",
    "avatar": "https://i.pravatar.cc/150?u=user@example.com",
    "joinedAt": "2026-05-02T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAtUtc": "2026-05-03T10:30:00Z"
}
```

**Error:** (400)
```json
{
  "message": "Email already registered"
}
```

---

### 2. POST /api/auth/login
Authenticate user and get auth token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:** (200)
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "applyAs": "Participant"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAtUtc": "2026-05-03T10:30:00Z"
}
```

**Error:** (401)
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. POST /api/auth/reset-password
Reset user password.

**Request:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response:** (204)
No content

**Headers:** 
- Authorization: Bearer {token}

---

### 4. POST /api/auth/logout
Logout user.

**Response:** (204)
No content

**Headers:** 
- Authorization: Bearer {token}

---

## 📅 Events

### 5. GET /api/event
Get all events (paginated).

**Query Parameters:**
- page: int (default: 1)
- pageSize: int (default: 20)

**Response:** (200)
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Conference 2026",
      "description": "Learn React from experts",
      "venue": "San Francisco Convention Center",
      "categoryId": 1,
      "categoryName": "Technology",
      "eventDate": "2026-06-15T09:00:00Z",
      "ticketPrice": 99.99,
      "totalTickets": 500,
      "availableTickets": 247,
      "image": "https://example.com/image.jpg",
      "organizerId": 1,
      "organizerName": "Tech Events Inc",
      "status": "Approved",
      "rating": 4.8,
      "reviews": 156,
      "createdAt": "2026-04-01T10:00:00Z"
    }
  ],
  "total": 142,
  "page": 1,
  "pageSize": 20
}
```

---

### 6. GET /api/event/approved
Get only approved events.

**Query Parameters:**
- page: int (default: 1)
- pageSize: int (default: 20)

**Response:** (200)
Same format as GET /api/event, but only approved events.

---

### 7. GET /api/event/pending
Get pending events (admin only).

**Response:** (200)
```json
{
  "data": [
    {
      "id": 501,
      "title": "Community Cleanup Drive",
      "description": "Clean up local parks",
      "venue": "Central Park",
      "organizerId": 2,
      "organizerName": "Bob Smith",
      "eventDate": "2026-05-10T08:00:00Z",
      "status": "Pending",
      "submittedAt": "2026-05-01T14:30:00Z"
    }
  ]
}
```

**Headers:** 
- Authorization: Bearer {admin_token}

---

### 8. GET /api/event/upcoming
Get upcoming events (within next N days).

**Query Parameters:**
- count: int (default: 10, how many events to return)

**Response:** (200)
```json
{
  "data": [
    {
      "id": 1,
      "title": "React Conference 2026",
      "eventDate": "2026-06-15T09:00:00Z",
      "ticketPrice": 99.99,
      // ... full event object
    }
  ]
}
```

---

### 9. GET /api/event/search
Search events with filters.

**Query Parameters:**
- keyword: string (search in title, description, venue)
- categoryId: int
- minPrice: decimal
- maxPrice: decimal
- eventDate: date (YYYY-MM-DD)
- page: int
- pageSize: int

**Response:** (200)
Same format as GET /api/event

**Example:**
```
GET /api/event/search?keyword=concert&categoryId=2&minPrice=50&maxPrice=150
```

---

### 10. GET /api/event/:id
Get single event by ID.

**Response:** (200)
```json
{
  "id": 1,
  "title": "React Conference 2026",
  "description": "Learn the latest in React development",
  "venue": "San Francisco Convention Center",
  "categoryId": 1,
  "categoryName": "Technology",
  "eventDate": "2026-06-15T09:00:00Z",
  "ticketPrice": 99.99,
  "totalTickets": 500,
  "availableTickets": 247,
  "image": "https://example.com/image.jpg",
  "organizerId": 1,
  "organizerName": "Tech Events Inc",
  "status": "Approved",
  "rating": 4.8,
  "reviews": 156,
  "createdAt": "2026-04-01T10:00:00Z"
}
```

**Error:** (404)
```json
{
  "message": "Event not found"
}
```

---

### 11. GET /api/event/:id/analytics
Get event analytics (organizer only).

**Response:** (200)
```json
{
  "eventId": 1,
  "totalTicketsSold": 243,
  "totalRevenue": 24299.57,
  "averageRating": 4.8,
  "reviewCount": 156,
  "viewCount": 3421,
  "conversionRate": 7.1
}
```

**Headers:** 
- Authorization: Bearer {organizer_token}

**Error:** (403)
Not organizer of this event

---

### 12. POST /api/event
Create new event (organizer only).

**Request:**
```json
{
  "title": "My Event",
  "description": "Event description",
  "venue": "Event venue address",
  "categoryId": 1,
  "eventDate": "2026-06-15T09:00:00Z",
  "ticketPrice": 49.99,
  "totalTickets": 100,
  "image": "base64_encoded_image_or_url"
}
```

**Response:** (201)
```json
{
  "id": 1,
  "title": "My Event",
  "description": "Event description",
  "venue": "Event venue address",
  "categoryId": 1,
  "eventDate": "2026-06-15T09:00:00Z",
  "ticketPrice": 49.99,
  "totalTickets": 100,
  "availableTickets": 100,
  "status": "Pending",
  "organizerId": 1,
  "createdAt": "2026-05-02T12:00:00Z"
}
```

**Headers:** 
- Authorization: Bearer {organizer_token}

---

### 13. PUT /api/event/:id
Update event (organizer only).

**Request:** (same fields as create)

**Response:** (204)
No content

**Headers:** 
- Authorization: Bearer {token}

---

### 14. DELETE /api/event/:id
Delete event (organizer only).

**Response:** (204)
No content

---

## 🏷️ Categories

### 15. GET /api/category
Get all categories.

**Response:** (200)
```json
[
  {
    "id": 1,
    "name": "Technology",
    "count": 24
  },
  {
    "id": 2,
    "name": "Music",
    "count": 18
  }
]
```

---

### 16. GET /api/category/:id
Get category by ID.

**Response:** (200)
```json
{
  "id": 1,
  "name": "Technology",
  "count": 24
}
```

---

### 17. GET /api/category/name/:name
Get category by name.

**Response:** (200)
```json
{
  "id": 1,
  "name": "Technology",
  "count": 24
}
```

---

### 18. GET /api/category/with-counts
Get categories with event counts.

**Response:** (200)
```json
[
  {
    "id": 1,
    "name": "Technology",
    "count": 24
  }
]
```

---

### 19. POST /api/category
Create category (admin only).

**Request:**
```json
{
  "name": "New Category"
}
```

**Response:** (201)

---

### 20. PUT /api/category/:id
Update category (admin only).

**Response:** (204)

---

### 21. DELETE /api/category/:id
Delete category (admin only).

**Response:** (204)

---

## 🎫 Tickets

### 22. POST /api/ticket/book
Book tickets for event.

**Request:**
```json
{
  "eventId": 1,
  "participantId": 1,
  "quantity": 2
}
```

**Response:** (201)
```json
{
  "id": "ticket_123",
  "eventId": 1,
  "participantId": 1,
  "quantity": 2,
  "totalPrice": 199.98,
  "bookingDate": "2026-05-02T12:00:00Z",
  "status": "Confirmed",
  "qrCode": "QR123456789"
}
```

**Error:** (400)
```json
{
  "message": "Only 10 tickets available"
}
```

**Headers:** 
- Authorization: Bearer {token}

---

### 23. GET /api/ticket/participant/:participantId
Get participant's tickets.

**Response:** (200)
```json
[
  {
    "id": "ticket_123",
    "eventId": 1,
    "eventTitle": "React Conference 2026",
    "quantity": 2,
    "totalPrice": 199.98,
    "bookingDate": "2026-05-02T12:00:00Z",
    "status": "Confirmed",
    "qrCode": "QR123456789"
  }
]
```

---

### 24. GET /api/ticket/participant/:participantId/has-purchased/:eventId
Check if participant purchased event.

**Response:** (200)
```json
{
  "hasPurchased": true,
  "quantity": 2
}
```

OR

```json
{
  "hasPurchased": false
}
```

---

### 25. GET /api/ticket/event/:eventId
Get all tickets for event (organizer only).

**Response:** (200)
```json
[
  {
    "id": "ticket_123",
    "participantId": 1,
    "participantName": "John Doe",
    "quantity": 2,
    "totalPrice": 199.98,
    "bookingDate": "2026-05-02T12:00:00Z"
  }
]
```

---

### 26. GET /api/ticket/:id
Get specific ticket.

**Response:** (200)
```json
{
  "id": "ticket_123",
  "eventId": 1,
  "participantId": 1,
  "quantity": 2,
  "totalPrice": 199.98,
  "bookingDate": "2026-05-02T12:00:00Z",
  "qrCode": "QR123456789"
}
```

---

### 27. GET /api/ticket/qr/:qrCode
Get ticket by QR code.

**Response:** (200)
Same format as GET /api/ticket/:id

---

## ⭐ Reviews

### 28. POST /api/review
Submit review for event.

**Request:**
```json
{
  "eventId": 1,
  "participantId": 1,
  "rating": 5,
  "text": "Great event!"
}
```

**Response:** (201)
```json
{
  "id": 1,
  "eventId": 1,
  "participantId": 1,
  "participantName": "John Doe",
  "rating": 5,
  "text": "Great event!",
  "createdAt": "2026-05-02T12:00:00Z"
}
```

**Headers:** 
- Authorization: Bearer {token}

---

### 29. GET /api/review/event/:eventId
Get reviews for event.

**Response:** (200)
```json
[
  {
    "id": 1,
    "eventId": 1,
    "participantId": 1,
    "participantName": "John Doe",
    "rating": 5,
    "text": "Great event!",
    "createdAt": "2026-05-02T12:00:00Z"
  }
]
```

---

### 30. DELETE /api/review/:id
Delete review (owner or admin only).

**Response:** (204)

**Headers:** 
- Authorization: Bearer {token}

---

## ❤️ Favorites

### 31. POST /api/favorite
Add event to favorites.

**Request:**
```json
{
  "eventId": 1,
  "userId": 1
}
```

**Response:** (201)
```json
{
  "id": 1,
  "eventId": 1,
  "userId": 1,
  "addedAt": "2026-05-02T12:00:00Z"
}
```

**Headers:** 
- Authorization: Bearer {token}

---

### 32. GET /api/favorite/user/:userId
Get user's favorite events.

**Response:** (200)
```json
[
  {
    "id": 1,
    "eventId": 1,
    "title": "React Conference 2026",
    "venue": "San Francisco",
    "eventDate": "2026-06-15T09:00:00Z",
    "addedAt": "2026-05-02T12:00:00Z"
  }
]
```

---

### 33. DELETE /api/favorite/:id
Remove from favorites.

**Response:** (204)

**Headers:** 
- Authorization: Bearer {token}

---

## 👤 Users

### 34. GET /api/user/:id
Get user profile.

**Response:** (200)
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "applyAs": "Participant",
  "avatar": "https://i.pravatar.cc/150?u=user@example.com",
  "joinedAt": "2026-05-02T10:30:00Z"
}
```

---

### 35. GET /api/user/email/:email
Get user by email.

**Response:** (200)
Same as GET /api/user/:id

---

### 36. GET /api/user/check-email/:email
Check if email exists.

**Response:** (200)
```json
{
  "exists": true
}
```

---

### 37. PUT /api/user/:id
Update user profile.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "avatar": "image_url"
}
```

**Response:** (204)

**Headers:** 
- Authorization: Bearer {token}

---

### 38. DELETE /api/user/:id
Delete user account.

**Response:** (204)

**Headers:** 
- Authorization: Bearer {admin_token}

---

## 🔐 Admin Endpoints

### 39. GET /api/admin/pending-accounts
Get pending organizer registration requests.

**Response:** (200)
```json
[
  {
    "id": 101,
    "email": "organizer@example.com",
    "firstName": "John",
    "lastName": "Organizer",
    "companyName": "Events Plus Inc",
    "appliedAt": "2026-05-01T14:30:00Z"
  }
]
```

**Headers:** 
- Authorization: Bearer {admin_token}

---

### 40. GET /api/admin/pending-events
Get pending event submissions.

**Response:** (200)
```json
[
  {
    "id": 501,
    "title": "Community Cleanup",
    "organizerId": 2,
    "organizerName": "Bob Smith",
    "submittedAt": "2026-05-01T14:30:00Z"
  }
]
```

---

### 41. POST /api/admin/accounts/:id/approve
Approve organizer account.

**Response:** (204)

---

### 42. POST /api/admin/accounts/:id/reject
Reject organizer account.

**Request:**
```json
{
  "reason": "Incomplete information"
}
```

**Response:** (204)

---

### 43. POST /api/admin/events/:id/approve
Approve event.

**Response:** (204)

---

### 44. POST /api/admin/events/:id/reject
Reject event.

**Request:**
```json
{
  "reason": "Violates community guidelines"
}
```

**Response:** (204)

---

## 🔄 General Requirements

### Authentication Header
All endpoints requiring authentication need:
```
Authorization: Bearer {jwt_token}
```

### CORS Headers
All responses should include:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

### Error Responses
All errors should follow this format:
```json
{
  "message": "Error description",
  "statusCode": 400
}
```

### Status Codes
- 200: Success (GET, POST returning data)
- 201: Created (POST, PUT creating new resource)
- 204: No Content (DELETE, PUT)
- 400: Bad Request (validation error)
- 401: Unauthorized (not authenticated)
- 403: Forbidden (authenticated but no permission)
- 404: Not Found
- 500: Server Error

---

## ✅ Implementation Checklist

- [ ] All 44 endpoints implemented
- [ ] JWT authentication working
- [ ] CORS configured
- [ ] Response formats match specifications exactly
- [ ] Error handling returns proper status codes
- [ ] Pagination working for list endpoints
- [ ] Authorization checks for protected endpoints
- [ ] Database migrations created
- [ ] API documentation generated (Swagger/OpenAPI)
- [ ] Load testing completed
- [ ] Security review done

---

## 📞 Questions?

Contact the frontend team to clarify any specifications.

**Frontend is ready to integrate!** 🚀
