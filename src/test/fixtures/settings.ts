import type { SettingsState } from '../../store/settingsSlice'
import type { Settings } from '../../types/settings'

export const mockSettings: Settings = {
  maxTicketsPerBooking: 5,
  bookingTimeoutMinutes: 10,
  serviceFeePercentage: 2.5,
}

export const defaultSettingsState: SettingsState = {
  data: null,
  status: 'idle',
  error: null,
  saveStatus: 'idle',
  saveError: null,
}
