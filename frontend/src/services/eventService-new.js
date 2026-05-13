/**
 * Re-export from service factory
 * 
 * This enables switching between mock and real API calls.
 * To toggle between mock and real, change USE_MOCK_SERVICES in serviceFactory.js
 * 
 * Mock Mode (Development): Returns realistic mock data instantly
 * Real Mode (Production): Calls actual backend API
 */
export { eventService } from './serviceFactory';
