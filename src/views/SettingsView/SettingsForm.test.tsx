import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SettingsForm } from './SettingsForm'

describe('SettingsForm', () => {
  const mockOnSubmit = vi.fn()

  const defaultProps = {
    initialValues: {
      maxTicketsPerBooking: 5,
      bookingTimeoutMinutes: 10,
      serviceFeePercentage: 2.5,
    },
    onSubmit: mockOnSubmit,
    isSaving: false,
    saveStatus: 'idle' as const,
    saveError: null,
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders the form fields with initial values', () => {
    render(<SettingsForm {...defaultProps} />)

    expect(screen.getByLabelText(/Max tickets per booking/i)).toHaveValue(5)
    expect(screen.getByLabelText(/Booking timeout/i)).toHaveValue(10)
    expect(screen.getByLabelText(/Service fee/i)).toHaveValue(2.5)
    
    const submitButton = screen.getByRole('button', { name: /Save settings/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).not.toBeDisabled()
  })

  it('shows validation errors for invalid inputs', async () => {
    render(<SettingsForm {...defaultProps} />)

    const maxTicketsInput = screen.getByLabelText(/Max tickets per booking/i)
    const serviceFeeInput = screen.getByLabelText(/Service fee/i)

    fireEvent.change(maxTicketsInput, { target: { value: '0' } })
    fireEvent.blur(maxTicketsInput)

    fireEvent.change(serviceFeeInput, { target: { value: '150' } })
    fireEvent.blur(serviceFeeInput)

    await waitFor(() => {
      expect(screen.getByText('Must be at least 1')).toBeInTheDocument()
      expect(screen.getByText('Must be at most 100')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with updated values when submitted', async () => {
    mockOnSubmit.mockResolvedValueOnce(undefined)
    render(<SettingsForm {...defaultProps} />)

    const maxTicketsInput = screen.getByLabelText(/Max tickets per booking/i)
    const submitButton = screen.getByRole('button', { name: /Save settings/i })

    fireEvent.change(maxTicketsInput, { target: { value: '8' } })
    
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          maxTicketsPerBooking: 8, // The updated value
          bookingTimeoutMinutes: 10,
          serviceFeePercentage: 2.5,
        },
        expect.anything() // Formik helpers
      )
    })
  })

  it('disables the submit button and changes text when isSaving is true', () => {
    render(<SettingsForm {...defaultProps} isSaving={true} />)

    const submitButton = screen.getByRole('button', { name: /Saving…/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('displays success alert when saveStatus is succeeded', () => {
    render(<SettingsForm {...defaultProps} saveStatus="succeeded" />)

    expect(screen.getByText(/Settings saved successfully/i)).toBeInTheDocument()
  })

  it('displays error alert when saveStatus is failed', () => {
    render(
      <SettingsForm 
        {...defaultProps} 
        saveStatus="failed" 
        saveError="Network Error: Could not reach server" 
      />
    )

    expect(screen.getByText(/Network Error: Could not reach server/i)).toBeInTheDocument()
  })
})
