import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import '../../test/mocks/reduxHooks'
import '../../test/mocks/eventsSlice'
import { reduxMocks } from '../../test/mocks/reduxHooks'
import { mockEvents } from '../../test/fixtures/events'
import { resetReduxMocks, setMockReduxState } from '../../test/utils/mockReduxState'
import { EventListView } from './EventListView'
import { fetchEvents } from '../../store/eventsSlice'
import type { EventsState } from '../../store/eventsSlice'

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

const mockNavigate = vi.fn()

function renderEventListView(state: Partial<EventsState> = {}) {
  setMockReduxState({ events: state })
  vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  return render(
    <MemoryRouter>
      <EventListView />
    </MemoryRouter>
  )
}

describe('EventListView', () => {
  beforeEach(() => {
    resetReduxMocks()
    mockNavigate.mockReset()
  })

  it('dispatches fetchEvents on mount', () => {
    renderEventListView({ status: 'loading' })

    expect(fetchEvents).toHaveBeenCalledTimes(1)
    expect(fetchEvents).toHaveBeenCalledWith({
      page: 1,
      size: 8,
      fields: ['id', 'name', 'location', 'date'],
    })
    expect(reduxMocks.mockDispatch).toHaveBeenCalledWith({
      type: 'events/fetch',
      payload: {
        page: 1,
        size: 8,
        fields: ['id', 'name', 'location', 'date'],
      },
    })
  })

  it('shows loading spinner while fetching events', () => {
    renderEventListView({ status: 'loading', data: [] })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error alert when fetch fails', () => {
    renderEventListView({
      status: 'failed',
      data: [],
      error: 'Failed to fetch events',
    })

    expect(screen.getByText(/Failed to fetch events/i)).toBeInTheDocument()
  })

  it('renders events list with loaded data', () => {
    renderEventListView({ data: mockEvents, status: 'idle' })

    expect(screen.getByRole('heading', { name: /All Events/i })).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].name)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].location)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[1].name)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[1].location)).toBeInTheDocument()
  })

  it('shows events list instead of spinner when loading with existing data', () => {
    renderEventListView({ data: mockEvents, status: 'loading' })

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /All Events/i })).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].name)).toBeInTheDocument()
  })

  it('shows load more button when there is a next page', () => {
    renderEventListView({
      data: mockEvents,
      status: 'idle',
      meta: {
        totalItems: 50,
        totalPages: 2,
        currentPage: 1,
        nextPage: 2,
        prevPage: null,
      },
    })

    expect(screen.getByRole('button', { name: /Load more/i })).toBeInTheDocument()
  })

  it('hides load more button when there is no next page', () => {
    renderEventListView({
      data: mockEvents,
      status: 'idle',
      meta: {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        nextPage: null,
        prevPage: null,
      },
    })

    expect(screen.queryByRole('button', { name: /Load more/i })).not.toBeInTheDocument()
  })

  it('dispatches fetchEvents for the next page when load more is clicked', () => {
    renderEventListView({
      data: mockEvents,
      status: 'idle',
      meta: {
        totalItems: 50,
        totalPages: 2,
        currentPage: 1,
        nextPage: 2,
        prevPage: null,
      },
    })

    fireEvent.click(screen.getByRole('button', { name: /Load more/i }))

    expect(fetchEvents).toHaveBeenCalledWith({
      page: 2,
      size: 8,
      fields: ['id', 'name', 'location', 'date'],
    })
  })

  it('navigates to the event detail view when a card is clicked', () => {
    renderEventListView({ data: mockEvents, status: 'idle' })

    fireEvent.click(screen.getByRole('button', { name: new RegExp(mockEvents[0].name) }))

    expect(mockNavigate).toHaveBeenCalledWith(`/events/${mockEvents[0].id}`)
  })
})
