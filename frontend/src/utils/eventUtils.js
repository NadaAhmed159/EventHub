export function getEventCategory(event) {
  if (event?.categoryName) return event.categoryName;
  if (typeof event?.category === 'string') return event.category;
  if (typeof event?.category === 'object' && event?.category !== null) {
    return event.category.name || event.category.categoryName || 'Unknown Category';
  }
  return 'Unknown Category';
}

export function getEventPrice(event) {
  return Number(event?.ticketPrice ?? event?.price ?? 0);
}

export function getEventDate(event) {
  return event?.eventDate || event?.date || '';
}

export function getEventTitle(event) {
  return event?.title || '';
}

export function getEventAvailableTickets(event) {
  return Number(event?.availableTickets ?? event?.totalTickets ?? 0);
}

export function getEventTotalTickets(event) {
  return Number(event?.totalTickets ?? event?.availableTickets ?? 0);
}