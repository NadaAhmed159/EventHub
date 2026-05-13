import { useMemo, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header';
import FilterBar from '../../components/FilterBar';
import EventGrid from '../../components/EventGrid';
import { AuthContext } from '../../context/AuthContext';
import { useEvents } from '../../hooks/useEvents';
import { useParticipantTickets } from '../../hooks/useParticipantTickets';

export default function EventsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const filters = useMemo(() => ({
    selectedCategories: searchParams.getAll('category'),
    priceRange: {
      min: parseInt(searchParams.get('priceMin')) || 0,
      max: parseInt(searchParams.get('priceMax')) || 500,
    },
    dateRange: {
      start: searchParams.get('dateStart') || '',
      end: searchParams.get('dateEnd') || '',
    },
    searchTerm: searchParams.get('search') || '',
  }), [searchParams]);

  const { data: events = [], isLoading } = useEvents(filters);
  const { bookedEventIds } = useParticipantTickets(user?.id, isAuthenticated);

  // Update URL params when filters change
  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };

    // Update URL params
    const params = new URLSearchParams();
    if (updated.searchTerm) params.set('search', updated.searchTerm);
    if (updated.selectedCategories.length > 0) {
      updated.selectedCategories.forEach((cat) => params.append('category', cat));
    }
    if (updated.priceRange.min > 0) params.set('priceMin', updated.priceRange.min);
    if (updated.priceRange.max < 500) params.set('priceMax', updated.priceRange.max);
    if (updated.dateRange.start) params.set('dateStart', updated.dateRange.start);
    if (updated.dateRange.end) params.set('dateEnd', updated.dateRange.end);
    setSearchParams(params);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />

      {/* Filter Bar */}
      <FilterBar
        onFilterChange={handleFilterChange}
        selectedCategories={filters.selectedCategories}
        priceRange={filters.priceRange}
        dateRange={filters.dateRange}
      />

      {/* Events Grid */}
      <EventGrid
        events={events}
        isLoading={isLoading}
        isEmpty={events.length === 0 && !isLoading}
        bookedEventIds={bookedEventIds}
      />
    </div>
  );
}
