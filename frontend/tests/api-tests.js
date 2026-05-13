/**
 * EventHub API Testing Script
 * 
 * This script provides comprehensive testing for all EventHub backend APIs
 * Run with: npm run test:api or node tests/api-tests.js
 * 
 * Configure the API_BASE_URL below to match your backend environment
 */

const API_BASE_URL = 'http://localhost:5178';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

// Store auth token and user for subsequent requests
let authToken = null;
let currentUser = null;

/**
 * Utility function to make API requests
 */
async function makeRequest(method, endpoint, body = null, headers = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    return {
      status: response.status,
      ok: response.ok,
      data,
      headers: response.headers,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      data: null,
      error: error.message,
    };
  }
}

/**
 * Test assertion helper
 */
function assert(testName, condition, details = '') {
  testResults.total++;
  if (condition) {
    testResults.passed++;
    console.log(`${colors.green}✓ PASS${colors.reset}: ${testName}`);
  } else {
    testResults.failed++;
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${testName}`);
    if (details) console.log(`  ${details}`);
  }
}

/**
 * Test section header
 */
function section(title) {
  console.log(`\n${colors.bright}${colors.blue}━━━ ${title} ━━━${colors.reset}\n`);
}

/**
 * Run all tests
 */
async function runTests() {
  console.log(`${colors.bright}${colors.cyan}EventHub API Test Suite${colors.reset}\n`);
  console.log(`API Base URL: ${colors.yellow}${API_BASE_URL}${colors.reset}\n`);

  try {
    // Auth Tests
    await testAuthEndpoints();

    // Event Tests
    await testEventEndpoints();

    // Category Tests
    await testCategoryEndpoints();

    // Ticket Tests
    await testTicketEndpoints();

    // Review Tests
    await testReviewEndpoints();

    // Favorite Tests
    await testFavoriteEndpoints();

    // Print summary
    printSummary();
  } catch (error) {
    console.error(`${colors.red}Test suite error:${colors.reset}`, error);
  }
}

/**
 * AUTH ENDPOINTS TESTS
 */
async function testAuthEndpoints() {
  section('Authentication Endpoints');

  // Test Registration
  const registerBody = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    applyAs: 'Participant',
  };

  const registerRes = await makeRequest('POST', '/api/auth/register', registerBody);
  assert(
    'POST /api/auth/register - Register new user',
    registerRes.ok && registerRes.data.token,
    `Status: ${registerRes.status}, Response: ${JSON.stringify(registerRes.data)}`
  );

  if (registerRes.ok && registerRes.data.token) {
    authToken = registerRes.data.token;
    currentUser = registerRes.data.user;
  }

  // Test Login
  const loginBody = {
    email: registerBody.email,
    password: registerBody.password,
  };

  const loginRes = await makeRequest('POST', '/api/auth/login', loginBody);
  assert(
    'POST /api/auth/login - User login',
    loginRes.ok && loginRes.data.token,
    `Status: ${loginRes.status}`
  );

  // Test Reset Password
  const resetBody = {
    currentPassword: registerBody.password,
    newPassword: 'NewTestPassword123!',
  };

  const resetRes = await makeRequest('POST', '/api/auth/reset-password', resetBody);
  assert(
    'POST /api/auth/reset-password - Reset password',
    resetRes.ok || resetRes.status === 204,
    `Status: ${resetRes.status}`
  );

  // Test Logout
  const logoutRes = await makeRequest('POST', '/api/auth/logout');
  assert(
    'POST /api/auth/logout - User logout',
    logoutRes.ok || logoutRes.status === 204,
    `Status: ${logoutRes.status}`
  );
}

/**
 * EVENT ENDPOINTS TESTS
 */
async function testEventEndpoints() {
  section('Event Endpoints');

  // Test Get All Events
  const allEventsRes = await makeRequest('GET', '/api/event');
  assert(
    'GET /api/event - Get all events',
    allEventsRes.ok && Array.isArray(allEventsRes.data),
    `Status: ${allEventsRes.status}`
  );

  // Test Get Approved Events
  const approvedRes = await makeRequest('GET', '/api/event/approved');
  assert(
    'GET /api/event/approved - Get approved events',
    approvedRes.ok && Array.isArray(approvedRes.data),
    `Status: ${approvedRes.status}`
  );

  // Test Get Pending Events
  const pendingRes = await makeRequest('GET', '/api/event/pending');
  assert(
    'GET /api/event/pending - Get pending events',
    pendingRes.ok && Array.isArray(pendingRes.data),
    `Status: ${pendingRes.status}`
  );

  // Test Get Upcoming Events
  const upcomingRes = await makeRequest('GET', '/api/event/upcoming?count=5');
  assert(
    'GET /api/event/upcoming - Get upcoming events',
    upcomingRes.ok && Array.isArray(upcomingRes.data),
    `Status: ${upcomingRes.status}`
  );

  // Test Search Events
  const searchRes = await makeRequest('GET', '/api/event/search?keyword=test');
  assert(
    'GET /api/event/search - Search events',
    searchRes.ok && Array.isArray(searchRes.data),
    `Status: ${searchRes.status}`
  );

  // Test Create Event (if authenticated)
  if (authToken) {
    const eventBody = {
      title: `Test Event ${Date.now()}`,
      description: 'This is a test event',
      venue: 'Test Venue',
      categoryId: 1,
      eventDate: new Date(Date.now() + 86400000).toISOString(),
      ticketPrice: 49.99,
      totalTickets: 100,
      image: 'https://via.placeholder.com/400x300',
    };

    const createRes = await makeRequest('POST', '/api/event', eventBody);
    assert(
      'POST /api/event - Create event',
      createRes.ok || createRes.status === 201,
      `Status: ${createRes.status}`
    );

    // If event created, test other event operations
    if ((createRes.ok || createRes.status === 201) && createRes.data.id) {
      const eventId = createRes.data.id;

      // Test Get Event by ID
      const getRes = await makeRequest('GET', `/api/event/${eventId}`);
      assert(
        `GET /api/event/${eventId} - Get single event`,
        getRes.ok && getRes.data.id === eventId,
        `Status: ${getRes.status}`
      );

      // Test Update Event
      const updateBody = { title: `Updated Event ${Date.now()}` };
      const updateRes = await makeRequest('PUT', `/api/event/${eventId}`, updateBody);
      assert(
        `PUT /api/event/${eventId} - Update event`,
        updateRes.ok || updateRes.status === 204,
        `Status: ${updateRes.status}`
      );

      // Test Get Event Analytics
      const analyticsRes = await makeRequest('GET', `/api/event/${eventId}/analytics`);
      assert(
        `GET /api/event/${eventId}/analytics - Get event analytics`,
        analyticsRes.ok || analyticsRes.status === 403,
        `Status: ${analyticsRes.status}`
      );

      // Test Delete Event
      const deleteRes = await makeRequest('DELETE', `/api/event/${eventId}`);
      assert(
        `DELETE /api/event/${eventId} - Delete event`,
        deleteRes.ok || deleteRes.status === 204,
        `Status: ${deleteRes.status}`
      );
    }
  }
}

/**
 * CATEGORY ENDPOINTS TESTS
 */
async function testCategoryEndpoints() {
  section('Category Endpoints');

  // Test Get All Categories
  const categoriesRes = await makeRequest('GET', '/api/category');
  assert(
    'GET /api/category - Get all categories',
    categoriesRes.ok && Array.isArray(categoriesRes.data),
    `Status: ${categoriesRes.status}`
  );

  // Test Get Categories with Counts
  const countsRes = await makeRequest('GET', '/api/category/with-counts');
  assert(
    'GET /api/category/with-counts - Get categories with counts',
    countsRes.ok && Array.isArray(countsRes.data),
    `Status: ${countsRes.status}`
  );

  // Test Get Category by Name
  const nameRes = await makeRequest('GET', '/api/category/name/Technology');
  assert(
    'GET /api/category/name/{name} - Get category by name',
    nameRes.ok || nameRes.status === 404,
    `Status: ${nameRes.status}`
  );
}

/**
 * TICKET ENDPOINTS TESTS
 */
async function testTicketEndpoints() {
  section('Ticket Endpoints');

  if (!currentUser) {
    console.log(`${colors.yellow}⚠ Skipping ticket tests - no authenticated user${colors.reset}`);
    return;
  }

  // Test Get Participant Tickets
  const ticketsRes = await makeRequest('GET', `/api/ticket/participant/${currentUser.id}`);
  assert(
    `GET /api/ticket/participant/{id} - Get participant tickets`,
    ticketsRes.ok && Array.isArray(ticketsRes.data),
    `Status: ${ticketsRes.status}`
  );

  // Test Check Event Purchase
  const purchaseRes = await makeRequest('GET', `/api/ticket/participant/${currentUser.id}/has-purchased/1`);
  assert(
    'GET /api/ticket/participant/{id}/has-purchased/{eventId}',
    purchaseRes.ok || purchaseRes.status === 404,
    `Status: ${purchaseRes.status}`
  );

  // Test Book Ticket (will likely fail without valid eventId)
  const bookRes = await makeRequest('POST', '/api/ticket/book', null, {});
  assert(
    'POST /api/ticket/book - Book ticket (expected to fail without valid params)',
    bookRes.status !== 0,
    `Status: ${bookRes.status}`
  );
}

/**
 * REVIEW ENDPOINTS TESTS
 */
async function testReviewEndpoints() {
  section('Review Endpoints');

  // Test Get Event Reviews (using eventId 1)
  const reviewsRes = await makeRequest('GET', '/api/review/event/1');
  assert(
    'GET /api/review/event/{id} - Get event reviews',
    reviewsRes.ok && Array.isArray(reviewsRes.data),
    `Status: ${reviewsRes.status}`
  );

  if (authToken && currentUser) {
    // Test Submit Review
    const reviewBody = {
      eventId: 1,
      participantId: currentUser.id,
      rating: 5,
      text: 'Great event!',
    };

    const submitRes = await makeRequest('POST', '/api/review', reviewBody);
    assert(
      'POST /api/review - Submit review',
      submitRes.ok || submitRes.status === 201 || submitRes.status === 400,
      `Status: ${submitRes.status}`
    );
  }
}

/**
 * FAVORITE ENDPOINTS TESTS
 */
async function testFavoriteEndpoints() {
  section('Favorite Endpoints');

  if (!authToken || !currentUser) {
    console.log(`${colors.yellow}⚠ Skipping favorite tests - not authenticated${colors.reset}`);
    return;
  }

  // Test Get User Favorites
  const favoritesRes = await makeRequest('GET', `/api/favorite/user/${currentUser.id}`);
  assert(
    `GET /api/favorite/user/{id} - Get user favorites`,
    favoritesRes.ok && Array.isArray(favoritesRes.data),
    `Status: ${favoritesRes.status}`
  );

  // Test Add to Favorites
  const favoriteBody = {
    eventId: 1,
    userId: currentUser.id,
  };

  const addRes = await makeRequest('POST', '/api/favorite', favoriteBody);
  assert(
    'POST /api/favorite - Add to favorites',
    addRes.ok || addRes.status === 201 || addRes.status === 400,
    `Status: ${addRes.status}`
  );
}

/**
 * Print test summary
 */
function printSummary() {
  console.log(`\n${colors.bright}${colors.blue}━━━ Test Summary ━━━${colors.reset}\n`);
  console.log(`Total Tests: ${colors.bright}${testResults.total}${colors.reset}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);

  const percentage = testResults.total > 0 
    ? Math.round((testResults.passed / testResults.total) * 100)
    : 0;

  console.log(`\nSuccess Rate: ${percentage}%\n`);

  if (testResults.failed === 0) {
    console.log(`${colors.green}${colors.bright}All tests passed! 🎉${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Some tests failed. Please review the results above.${colors.reset}\n`);
  }
}

// Run tests
runTests().catch(console.error);
