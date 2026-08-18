import { vi } from 'vitest'

vi.mock('../../store/settingsSlice', () => ({
  fetchSettings: vi.fn(() => ({ type: 'settings/fetch' })),
  resetSaveStatus: vi.fn(() => ({ type: 'settings/resetSaveStatus' })),
  updateSettings: vi.fn((payload) => ({ type: 'settings/update', payload })),
}))
