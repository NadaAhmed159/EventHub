/**
 * Service Factory
 * 
 * Determines whether to use mock or real API services based on environment.
 * 
 * Usage:
 *   import { eventService } from '../services/serviceFactory';
 *   const events = await eventService.getApprovedEvents();
 * 
 * To switch between mock and real:
 *   Change USE_MOCK_SERVICES in this file or via environment variable
 */

import * as mockServices from './mockServices';
import * as realServices from './realServices';

// ============================================
// TOGGLE THIS TO SWITCH BETWEEN MOCK & REAL
// ============================================
// Set VITE_USE_MOCK_SERVICES=true to use mock data locally.
const USE_MOCK_SERVICES = import.meta.env.VITE_USE_MOCK_SERVICES === 'true';
const shouldUseMock = USE_MOCK_SERVICES;

console.log(`%c⚙️  Service Mode: ${shouldUseMock ? '🎭 MOCK' : '🔌 REAL API'}`, 
  'color: #E63946; font-weight: bold; font-size: 12px;');

// Export the appropriate services
export const eventService = shouldUseMock ? mockServices.eventService : realServices.eventService;
export const ticketService = shouldUseMock ? mockServices.ticketService : realServices.ticketService;
export const categoryService = shouldUseMock ? mockServices.categoryService : realServices.categoryService;
export const favoriteService = shouldUseMock ? mockServices.favoriteService : realServices.favoriteService;
export const reviewService = shouldUseMock ? mockServices.reviewService : realServices.reviewService;
export const userService = shouldUseMock ? mockServices.userService : realServices.userService;
export const authService = shouldUseMock ? mockServices.authService : realServices.authService;
export const adminService = shouldUseMock ? mockServices.adminService : realServices.adminService;

/**
 * Switch between mock and real services programmatically
 * Useful for testing or switching during runtime
 */
export function setServiceMode(useMock) {
  console.log(`Switching to ${useMock ? 'MOCK' : 'REAL API'} mode. Refresh page for full effect.`);
}
