import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';

export function useParticipantTickets(userId, enabled = true) {
  const ticketsQuery = useQuery({
    queryKey: ['participant-tickets', userId],
    queryFn: () => ticketService.getParticipantTickets(userId),
    select: (response) => response.data || [],
    enabled: enabled && !!userId,
  });

  const tickets = useMemo(() => ticketsQuery.data || [], [ticketsQuery.data]);
  const bookedEventIds = useMemo(
    () => new Set(tickets.map((ticket) => Number(ticket.eventId))),
    [tickets]
  );

  return {
    ...ticketsQuery,
    tickets,
    bookedEventIds,
    bookedEventsCount: bookedEventIds.size,
    hasBookedEvent: (eventId) => bookedEventIds.has(Number(eventId)),
  };
}