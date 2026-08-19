import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  defaultEventsState,
  mockPaginatedEvents,
} from '../test/fixtures/events'
import reducer, { fetchEvents } from './eventsSlice'

describe('eventsSlice reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(defaultEventsState)
  })

  describe('fetchEvents', () => {
    it('sets loading status when pending', () => {
      const state = reducer(
        { ...defaultEventsState, error: 'previous error' },
        fetchEvents.pending('', undefined)
      )

      expect(state.status).toBe('loading')
      expect(state.error).toBeNull()
    })

    it('stores fetched events when fulfilled', () => {
      const state = reducer(
        { ...defaultEventsState, status: 'loading' },
        fetchEvents.fulfilled(mockPaginatedEvents, '', undefined)
      )

      expect(state.status).toBe('idle')
      expect(state.data).toEqual(mockPaginatedEvents.data)
      expect(state.meta).toEqual(mockPaginatedEvents.meta)
    })

    it('stores fetch error when rejected', () => {
      const state = reducer(
        { ...defaultEventsState, status: 'loading' },
        fetchEvents.rejected(
          new Error('Failed to fetch events'),
          '',
          undefined
        )
      )

      expect(state.status).toBe('failed')
      expect(state.error).toBe('Failed to fetch events')
    })
  })
})

describe('eventsSlice thunks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  function createTestStore() {
    return configureStore({
      reducer: { events: reducer },
    })
  }

  describe('fetchEvents', () => {
    it('fetches events from the API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedEvents,
      } as Response)

      const store = createTestStore()
      await store.dispatch(fetchEvents())

      expect(fetch).toHaveBeenCalledWith('/events')
      expect(store.getState().events).toEqual({
        ...defaultEventsState,
        data: mockPaginatedEvents.data,
        meta: mockPaginatedEvents.meta,
      })
    })

    it('fetches events with query params', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaginatedEvents,
      } as Response)

      const store = createTestStore()
      await store.dispatch(
        fetchEvents({
          page: 1,
          size: 10,
          fields: ['id', 'name', 'location', 'date'],
        })
      )

      expect(fetch).toHaveBeenCalledWith(
        '/events?page=1&size=10&fields=id%2Cname%2Clocation%2Cdate'
      )
      expect(store.getState().events).toEqual({
        ...defaultEventsState,
        data: mockPaginatedEvents.data,
        meta: mockPaginatedEvents.meta,
      })
    })

    it('marks fetch as failed when the API returns an error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const store = createTestStore()
      await store.dispatch(fetchEvents())

      expect(store.getState().events.status).toBe('failed')
      expect(store.getState().events.error).toBe('Failed to fetch events')
    })
  })
})
