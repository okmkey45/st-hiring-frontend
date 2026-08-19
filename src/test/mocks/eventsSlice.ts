import { vi } from 'vitest'

vi.mock('../../store/eventsSlice', () => ({
  fetchEvents: vi.fn((payload) => ({ type: 'events/fetch', payload })),
}))
