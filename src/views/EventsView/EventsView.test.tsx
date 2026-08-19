import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import '../../test/mocks/reduxHooks'
import '../../test/mocks/eventsSlice'
import { reduxMocks } from '../../test/mocks/reduxHooks'
import { mockEvents } from '../../test/fixtures/events'
import { resetReduxMocks, setMockReduxState } from '../../test/utils/mockReduxState'
import { EventsView } from './EventsView'
import { fetchEvents } from '../../store/eventsSlice'
import type { EventsState } from '../../store/eventsSlice'

function renderEventsView(state: Partial<EventsState> = {}) {
  setMockReduxState({ events: state })
  return render(<EventsView />)
}

describe('EventsView', () => {
  beforeEach(() => {
    resetReduxMocks()
  })

  it('dispatches fetchEvents on mount', () => {
    renderEventsView({ status: 'loading' })

    expect(fetchEvents).toHaveBeenCalledTimes(1)
    expect(fetchEvents).toHaveBeenCalledWith({
      page: 1,
      size: 10,
      fields: ['id', 'name', 'location', 'date'],
    })
    expect(reduxMocks.mockDispatch).toHaveBeenCalledWith({
      type: 'events/fetch',
      payload: {
        page: 1,
        size: 10,
        fields: ['id', 'name', 'location', 'date'],
      },
    })
  })

  it('shows loading spinner while fetching events', () => {
    renderEventsView({ status: 'loading', data: [] })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error alert when fetch fails', () => {
    renderEventsView({
      status: 'failed',
      data: [],
      error: 'Failed to fetch events',
    })

    expect(screen.getByText(/Failed to fetch events/i)).toBeInTheDocument()
  })

  it('renders events list with loaded data', () => {
    renderEventsView({ data: mockEvents, status: 'idle' })

    expect(screen.getByRole('heading', { name: /All Events/i })).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].name)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].location)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[1].name)).toBeInTheDocument()
    expect(screen.getByText(mockEvents[1].location)).toBeInTheDocument()
  })

  it('shows events list instead of spinner when loading with existing data', () => {
    renderEventsView({ data: mockEvents, status: 'loading' })

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /All Events/i })).toBeInTheDocument()
    expect(screen.getByText(mockEvents[0].name)).toBeInTheDocument()
  })
})
