import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { getEventCategory, getEventDate, getEventPrice, getEventTitle } from '../utils/eventUtils';

function buildEventDateSearchText(eventDateValue) {
  if (!eventDateValue) return '';

  const eventDate = new Date(eventDateValue);
  if (Number.isNaN(eventDate.getTime())) {
    return String(eventDateValue).toLowerCase();
  }

  const dateVariants = [
    eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    eventDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    eventDate.toLocaleDateString('en-US', { month: 'long' }),
    eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    eventDate.toLocaleDateString('en-US'),
  ];

  return dateVariants.join(' ').toLowerCase();
}

function matchesSearchTerm(event, searchTerm) {
  if (!searchTerm) return true;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return true;

  const title = getEventTitle(event).toLowerCase();
  const venue = (event.venue || '').toLowerCase();
  const category = getEventCategory(event).toLowerCase();
  const rawDate = (getEventDate(event) || '').toLowerCase();
  const dateText = buildEventDateSearchText(getEventDate(event));

  return (
    title.includes(normalizedSearch) ||
    venue.includes(normalizedSearch) ||
    category.includes(normalizedSearch) ||
    rawDate.includes(normalizedSearch) ||
    dateText.includes(normalizedSearch)
  );
}

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
        const hasSearchTerm = Boolean(searchTerm?.trim());

        // Call API with search filters
        const searchParams = {
          keyword: hasSearchTerm ? searchTerm.trim() : undefined,
          eventDate: dateRange.start || undefined,
          minPrice: priceRange.min > 0 ? priceRange.min : undefined,
          maxPrice: priceRange.max < 500 ? priceRange.max : undefined,
        };

        // Build search params (remove undefined values)
        const cleanParams = Object.fromEntries(
          Object.entries(searchParams).filter(([, v]) => v !== undefined)
        );

        // Avoid the keyword search endpoint for free-text searches so month names and partial dates
        // can match against the full approved event list client-side.
        let response;
        if (!hasSearchTerm && Object.keys(cleanParams).length > 0) {
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
          if (!matchesSearchTerm(event, searchTerm)) {
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
