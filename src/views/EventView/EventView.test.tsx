import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, it, expect } from 'vitest'
import { EventView } from './EventView'

function renderEventView(eventId: string) {
  return render(
    <MemoryRouter initialEntries={[`/events/${eventId}`]}>
      <Routes>
        <Route path="/events/:eventId" element={<EventView />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('EventView', () => {
  it('renders the event id from the route param', () => {
    renderEventView('42')

    expect(screen.getByRole('heading', { name: /Event 42/i })).toBeInTheDocument()
  })
})
