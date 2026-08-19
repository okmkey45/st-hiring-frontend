import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
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

  it('calls onClick when the card is clicked', () => {
    const handleClick = vi.fn()
    render(<EventCard event={mockEvent} onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is not clickable when onClick is omitted', () => {
    render(<EventCard event={mockEvent} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
