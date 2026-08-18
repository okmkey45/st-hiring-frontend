import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import '../../test/mocks/reduxHooks'
import '../../test/mocks/settingsSlice'
import { reduxMocks } from '../../test/mocks/reduxHooks'
import { mockSettings } from '../../test/fixtures/settings'
import { resetReduxMocks, setMockReduxState } from '../../test/utils/mockReduxState'
import { SettingsView } from './SettingsView'
import {
  fetchSettings,
  resetSaveStatus,
  updateSettings,
} from '../../store/settingsSlice'
import type { SettingsState } from '../../store/settingsSlice'

function renderSettingsView(state: Partial<SettingsState> = {}) {
  setMockReduxState({ settings: state })
  return render(<SettingsView />)
}

describe('SettingsView', () => {
  beforeEach(() => {
    resetReduxMocks()
  })

  it('dispatches fetchSettings on mount', () => {
    renderSettingsView({ status: 'loading' })

    expect(fetchSettings).toHaveBeenCalledTimes(1)
    expect(reduxMocks.mockDispatch).toHaveBeenCalledWith({ type: 'settings/fetch' })
  })

  it('shows loading spinner while fetching settings', () => {
    renderSettingsView({ status: 'loading', data: null })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('shows error alert when fetch fails', () => {
    renderSettingsView({
      status: 'failed',
      data: null,
      error: 'Failed to fetch settings',
    })

    expect(screen.getByText(/Failed to fetch settings/i)).toBeInTheDocument()
  })

  it('renders settings form with loaded data', () => {
    renderSettingsView({ data: mockSettings, status: 'idle' })

    expect(screen.getByRole('heading', { name: /Settings/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Configure booking limits and fees/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Max tickets per booking/i)).toHaveValue(5)
    expect(screen.getByLabelText(/Booking timeout/i)).toHaveValue(10)
    expect(screen.getByLabelText(/Service fee/i)).toHaveValue(2.5)
  })

  it('dispatches updateSettings with transformed values on submit', async () => {
    renderSettingsView({ data: mockSettings, status: 'idle' })

    fireEvent.change(screen.getByLabelText(/Max tickets per booking/i), {
      target: { value: '8' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Save settings/i }))

    await waitFor(() => {
      expect(resetSaveStatus).toHaveBeenCalledTimes(1)
      expect(updateSettings).toHaveBeenCalledWith({
        maxTicketsPerBooking: 8,
        bookingTimeoutMinutes: 10,
        serviceFeePercentage: 2.5,
      })
      expect(reduxMocks.mockDispatch).toHaveBeenCalledWith({
        type: 'settings/resetSaveStatus',
      })
      expect(reduxMocks.mockDispatch).toHaveBeenCalledWith({
        type: 'settings/update',
        payload: {
          maxTicketsPerBooking: 8,
          bookingTimeoutMinutes: 10,
          serviceFeePercentage: 2.5,
        },
      })
    })
  })

  it('displays success alert when saveStatus is succeeded', () => {
    renderSettingsView({
      data: mockSettings,
      status: 'idle',
      saveStatus: 'succeeded',
    })

    expect(screen.getByText(/Settings saved successfully/i)).toBeInTheDocument()
  })

  it('displays error alert when saveStatus is failed', () => {
    renderSettingsView({
      data: mockSettings,
      status: 'idle',
      saveStatus: 'failed',
      saveError: 'Failed to update settings',
    })

    expect(screen.getByText(/Failed to update settings/i)).toBeInTheDocument()
  })

  it('disables the submit button while saving', () => {
    renderSettingsView({
      data: mockSettings,
      status: 'idle',
      saveStatus: 'loading',
    })

    const submitButton = screen.getByRole('button', { name: /Saving…/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})
