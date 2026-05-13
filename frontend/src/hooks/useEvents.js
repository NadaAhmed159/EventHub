import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { getEventCategory, getEventDate, getEventPrice, getEventTitle } from '../utils/eventUtils';

/**
 * useEvents Hook - Fetches events with filtering and search
 * Falls back to mock data if API call fails for development purposes
 */
export function useEvents(filters = {}) {
  const {
    selectedCategories = [],
    priceRange = { min: 0, max: 500 },
    dateRange = { start: '', end: '' },
    searchTerm = '',
  } = filters;

  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      try {
        // Call API with search filters
        const searchParams = {
          keyword: searchTerm || undefined,
          eventDate: dateRange.start || undefined,
          minPrice: priceRange.min > 0 ? priceRange.min : undefined,
          maxPrice: priceRange.max < 500 ? priceRange.max : undefined,
        };

        // Build search params (remove undefined values)
        const cleanParams = Object.fromEntries(
          Object.entries(searchParams).filter(([, v]) => v !== undefined)
        );

        // If we have search filters, use search endpoint, otherwise get approved events
        let response;
        if (Object.keys(cleanParams).length > 0) {
          response = await eventService.searchEvents(cleanParams);
        } else {
          response = await eventService.getApprovedEvents();
        }

        let events = response.data;

        // Apply client-side filtering for complex filters
        events = events.filter((event) => {
          // Price filter
          const price = getEventPrice(event);
          if (price < priceRange.min || price > priceRange.max) {
            return false;
          }

          // Category filter (if multiple categories selected)
          const category = getEventCategory(event);
          if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
            return false;
          }

          // Date range filter
          const eventDate = new Date(getEventDate(event));
          if (dateRange.start) {
            const startDate = new Date(dateRange.start);
            if (eventDate < startDate) return false;
          }
          if (dateRange.end) {
            const endDate = new Date(dateRange.end);
            if (eventDate > endDate) return false;
          }

          // Search filter (for fields not covered by API)
          const title = getEventTitle(event).toLowerCase();
          const venue = (event.venue || '').toLowerCase();
          if (searchTerm && !title.includes(searchTerm.toLowerCase()) &&
              !venue.includes(searchTerm.toLowerCase())) {
            return false;
          }

          return true;
        });

        return events;
      } catch (error) {
        console.error('Failed to fetch events:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
