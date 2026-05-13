/**
 * Mock Data for Frontend Development
 *
 * This file provides realistic mock data that simulates backend responses.
 * When backend is ready, simply switch to real services in the environment config.
 */

// Mock Categories
export const mockCategories = [
  { id: 1, name: 'Technology', count: 24 },
  { id: 2, name: 'Music', count: 18 },
  { id: 3, name: 'Sports', count: 32 },
  { id: 4, name: 'Art & Culture', count: 15 },
  { id: 5, name: 'Business', count: 22 },
  { id: 6, name: 'Entertainment', count: 28 },
  { id: 7, name: 'Food & Drink', count: 19 },
  { id: 8, name: 'Education', count: 16 },
];

// Mock Events
export const mockEvents = [
  {
    id: 1,
    title: 'React Conference 2026',
    description: 'Learn the latest in React development from industry experts. Join us for keynote speeches, workshops, and networking sessions.',
    venue: 'San Francisco Convention Center',
    categoryId: 1,
    categoryName: 'Technology',
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 99.99,
    totalTickets: 500,
    availableTickets: 247,
    image: 'https://picsum.photos/seed/eventhub-tech/500/300',
    organizerId: 1,
    organizerName: 'Tech Events Inc',
    status: 'Approved',
    rating: 4.8,
    reviews: 156,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: 'Summer Music Festival',
    description: 'Three days of live music featuring international and local artists. Multiple stages, food vendors, and camping available.',
    venue: 'Central Park, New York',
    categoryId: 2,
    categoryName: 'Music',
    eventDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 149.99,
    totalTickets: 10000,
    availableTickets: 3200,
    image: 'https://picsum.photos/seed/eventhub-music/500/300',
    organizerId: 2,
    organizerName: 'Live Entertainment Co',
    status: 'Approved',
    rating: 4.6,
    reviews: 892,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: 'Basketball Championship 2026',
    description: 'Regional basketball championship featuring top local teams. Food, merchandise, and premium seating available.',
    venue: 'Downtown Arena',
    categoryId: 3,
    categoryName: 'Sports',
    eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 59.99,
    totalTickets: 5000,
    availableTickets: 1250,
    image: 'https://picsum.photos/seed/eventhub-sports/500/300',
    organizerId: 3,
    organizerName: 'Sports Promotions LLC',
    status: 'Approved',
    rating: 4.5,
    reviews: 234,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    title: 'Art Exhibition: Modern Perspectives',
    description: 'Contemporary art exhibition featuring emerging and established artists. Interactive installations, artist talks, and opening reception.',
    venue: 'Metropolitan Art Gallery',
    categoryId: 4,
    categoryName: 'Art & Culture',
    eventDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 25.99,
    totalTickets: 1000,
    availableTickets: 456,
    image: 'https://picsum.photos/seed/eventhub-art/500/300',
    organizerId: 4,
    organizerName: 'Art Society',
    status: 'Approved',
    rating: 4.7,
    reviews: 89,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: 'Startup Pitch Day 2026',
    description: 'Watch 20 innovative startups pitch to top investors. Networking, Q&A sessions, and refreshments included.',
    venue: 'Innovation Hub Downtown',
    categoryId: 5,
    categoryName: 'Business',
    eventDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 79.99,
    totalTickets: 300,
    availableTickets: 89,
    image: 'https://picsum.photos/seed/eventhub-business/500/300',
    organizerId: 5,
    organizerName: 'Venture Network',
    status: 'Approved',
    rating: 4.9,
    reviews: 145,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    title: 'Python Workshop',
    description: 'Master Python programming basics in this hands-on workshop.',
    venue: 'Tech Academy',
    categoryId: 8,
    categoryName: 'Education',
    eventDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 59.99,
    totalTickets: 50,
    availableTickets: 30,
    image: 'https://picsum.photos/seed/eventhub-education/500/300',
    organizerId: 6,
    organizerName: 'Tech Academy',
    status: 'Approved',
    rating: 4.7,
    reviews: 61,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    title: 'Yoga & Wellness Day',
    description: 'Rejuvenate your body and mind with guided yoga sessions.',
    venue: 'Central Park',
    categoryId: 7,
    categoryName: 'Health',
    eventDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 20,
    totalTickets: 300,
    availableTickets: 200,
    image: 'https://picsum.photos/seed/eventhub-health/500/300',
    organizerId: 7,
    organizerName: 'Wellness Co',
    status: 'Approved',
    rating: 4.5,
    reviews: 42,
    createdAt: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    title: 'Comedy Show - Stand Up Night',
    description: 'Laugh along with top comedians from around the world.',
    venue: 'Laugh Factory',
    categoryId: 6,
    categoryName: 'Entertainment',
    eventDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 40,
    totalTickets: 150,
    availableTickets: 45,
    image: 'https://picsum.photos/seed/eventhub-entertainment/500/300',
    organizerId: 8,
    organizerName: 'Comedy Nights',
    status: 'Approved',
    rating: 4.6,
    reviews: 58,
    createdAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    title: 'Web Development Bootcamp',
    description: 'Complete 4-week bootcamp covering React, Node, and more.',
    venue: 'Code Academy',
    categoryId: 8,
    categoryName: 'Education',
    eventDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 199.99,
    totalTickets: 40,
    availableTickets: 25,
    image: 'https://picsum.photos/seed/eventhub-webdev/500/300',
    organizerId: 6,
    organizerName: 'Code Academy',
    status: 'Approved',
    rating: 4.8,
    reviews: 73,
    createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    title: 'Rock Festival 2024',
    description: '3-day festival featuring the biggest rock bands.',
    venue: 'Festival Grounds',
    categoryId: 2,
    categoryName: 'Music',
    eventDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 99.99,
    totalTickets: 5000,
    availableTickets: 2000,
    image: 'https://picsum.photos/seed/eventhub-rock/500/300',
    organizerId: 2,
    organizerName: 'Music Events Co',
    status: 'Approved',
    rating: 4.9,
    reviews: 210,
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    title: 'AI & Machine Learning Summit',
    description: 'Explore cutting-edge AI technologies and use cases.',
    venue: 'Tech Center',
    categoryId: 1,
    categoryName: 'Technology',
    eventDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 79.99,
    totalTickets: 200,
    availableTickets: 100,
    image: 'https://picsum.photos/seed/eventhub-ai/500/300',
    organizerId: 1,
    organizerName: 'Tech Events Inc',
    status: 'Approved',
    rating: 4.8,
    reviews: 134,
    createdAt: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    title: 'Basketball Tournament',
    description: 'Watch professional basketball teams compete for the championship.',
    venue: 'City Arena',
    categoryId: 3,
    categoryName: 'Sports',
    eventDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 50,
    totalTickets: 800,
    availableTickets: 300,
    image: 'https://picsum.photos/seed/eventhub-basketball/500/300',
    organizerId: 3,
    organizerName: 'Sports Org',
    status: 'Approved',
    rating: 4.7,
    reviews: 187,
    createdAt: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Reviews
export const mockReviews = [
  {
    id: 1,
    eventId: 1,
    participantId: 101,
    participantName: 'Alice Johnson',
    rating: 5,
    text: 'Excellent conference! Great speakers and amazing networking opportunities.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    eventId: 1,
    participantId: 102,
    participantName: 'Bob Smith',
    rating: 4,
    text: 'Very informative. Would appreciate more hands-on workshops.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    eventId: 2,
    participantId: 103,
    participantName: 'Carol Williams',
    rating: 5,
    text: 'Best festival ever! Amazing lineup and great organization.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Users
export const mockUsers = {
  1: {
    id: 1,
    email: 'alice@example.com',
    firstName: 'Alice',
    lastName: 'Johnson',
    applyAs: 'Participant',
    avatar: 'https://i.pravatar.cc/150?u=alice@example.com',
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  2: {
    id: 2,
    email: 'bob@events.com',
    firstName: 'Bob',
    lastName: 'Smith',
    applyAs: 'EventOrganizer',
    avatar: 'https://i.pravatar.cc/150?u=bob@example.com',
    joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
  3: {
    id: 3,
    email: 'admin@eventhub.com',
    firstName: 'Admin',
    lastName: 'User',
    applyAs: 'Admin',
    avatar: 'https://i.pravatar.cc/150?u=admin@example.com',
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

// Mock Tickets (Bookings)
export const mockTickets = [
  {
    id: 1,
    eventId: 1,
    participantId: 1,
    quantity: 2,
    bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPrice: 199.98,
    status: 'Confirmed',
    qrCode: 'QR123456789',
  },
];

// Mock Favorites
export const mockFavorites = [
  {
    id: 1,
    eventId: 2,
    userId: 1,
    addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock Pending Accounts (for admin)
export const mockPendingAccounts = [
  {
    id: 101,
    email: 'organizer1@example.com',
    firstName: 'John',
    lastName: 'Organizer',
    applyAs: 'EventOrganizer',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    companyName: 'Events Plus Inc',
  },
  {
    id: 102,
    email: 'organizer2@example.com',
    firstName: 'Jane',
    lastName: 'Director',
    applyAs: 'EventOrganizer',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    companyName: 'Live Shows Co',
  },
];

// Mock Pending Events (for admin)
export const mockPendingEvents = [
  {
    id: 501,
    title: 'Community Cleanup Drive',
    description: 'Community event to clean up local parks.',
    venue: 'Central Park',
    organizerId: 2,
    organizerName: 'Bob Smith',
    categoryId: 5,
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 0,
    totalTickets: 100,
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Utility function to get random event
 */
export function getRandomEvent() {
  return mockEvents[Math.floor(Math.random() * mockEvents.length)];
}

/**
 * Utility function to search events
 */
export function searchMockEvents(filters) {
  let results = [...mockEvents];

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    results = results.filter(
      (e) =>
        e.title.toLowerCase().includes(keyword) ||
        e.description.toLowerCase().includes(keyword) ||
        e.venue.toLowerCase().includes(keyword)
    );
  }

  if (filters.categoryId) {
    results = results.filter((e) => e.categoryId === parseInt(filters.categoryId));
  }

  if (filters.minPrice !== undefined) {
    results = results.filter((e) => e.ticketPrice >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((e) => e.ticketPrice <= filters.maxPrice);
  }

  if (filters.eventDate) {
    const date = new Date(filters.eventDate);
    results = results.filter(
      (e) =>
        new Date(e.eventDate).toDateString() === date.toDateString()
    );
  }

  return results;
}

/**
 * Simulate API delay (more realistic)
 */
export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
