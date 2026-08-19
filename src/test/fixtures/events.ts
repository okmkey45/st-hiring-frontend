import type { Event, PaginatedEvents } from '../../types/events'
import type { EventsState } from '../../store/eventsSlice'

export const mockEvent = {
  id: 1,
  name: 'Summer Music Festival',
  date: '2026-08-19T14:30:00.000Z',
  location: 'Central Park Amphitheater',
  description: 'An outdoor evening of live music.',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} as Event

export const mockEvents: Event[] = [
  mockEvent,
  {
    id: 2,
    name: 'Jazz Night',
    date: '2026-09-05T19:00:00.000Z',
    location: 'Blue Note Club',
    description: 'An evening of live jazz.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  } as Event,
]

export const mockPaginatedEvents: PaginatedEvents = {
  data: mockEvents,
  meta: {
    totalItems: 2,
    totalPages: 1,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  },
}

export const defaultEventsState: EventsState = {
  data: [],
  meta: null,
  status: 'idle',
  error: null,
}
