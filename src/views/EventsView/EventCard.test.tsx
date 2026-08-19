import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EventCard } from './EventCard'
import { mockEvent } from '../../test/fixtures/events'

describe('EventCard', () => {
  it('renders the event name and location', () => {
    render(<EventCard event={mockEvent} />)

    expect(screen.getByText(mockEvent.name)).toBeInTheDocument()
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument()
  })

  it('renders the formatted date and time', () => {
    render(<EventCard event={mockEvent} />)

    const date = new Date(mockEvent.date)
    const monthDay = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
    const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
    const time = date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })

    expect(screen.getByText(monthDay)).toBeInTheDocument()
    expect(screen.getByText(`${weekday} · ${time}`)).toBeInTheDocument()
  })
})
