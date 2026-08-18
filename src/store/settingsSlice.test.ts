import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultSettingsState, mockSettings } from '../test/fixtures/settings'
import reducer, {
  fetchSettings,
  resetSaveStatus,
  updateSettings,
} from './settingsSlice'

describe('settingsSlice reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(defaultSettingsState)
  })

  it('resets save status and error', () => {
    const state = reducer(
      {
        ...defaultSettingsState,
        saveStatus: 'failed',
        saveError: 'Failed to update settings',
      },
      resetSaveStatus()
    )

    expect(state.saveStatus).toBe('idle')
    expect(state.saveError).toBeNull()
  })

  describe('fetchSettings', () => {
    it('sets loading status when pending', () => {
      const state = reducer(
        { ...defaultSettingsState, error: 'previous error' },
        fetchSettings.pending('', undefined)
      )

      expect(state.status).toBe('loading')
      expect(state.error).toBeNull()
    })

    it('stores fetched settings when fulfilled', () => {
      const state = reducer(
        { ...defaultSettingsState, status: 'loading' },
        fetchSettings.fulfilled(mockSettings, '', undefined)
      )

      expect(state.status).toBe('idle')
      expect(state.data).toEqual(mockSettings)
    })

    it('stores fetch error when rejected', () => {
      const state = reducer(
        { ...defaultSettingsState, status: 'loading' },
        fetchSettings.rejected(
          new Error('Failed to fetch settings'),
          '',
          undefined
        )
      )

      expect(state.status).toBe('failed')
      expect(state.error).toBe('Failed to fetch settings')
    })
  })

  describe('updateSettings', () => {
    it('sets save loading status when pending', () => {
      const state = reducer(
        { ...defaultSettingsState, saveError: 'previous error' },
        updateSettings.pending('', mockSettings)
      )

      expect(state.saveStatus).toBe('loading')
      expect(state.saveError).toBeNull()
    })

    it('stores updated settings when fulfilled', () => {
      const updatedSettings = {
        ...mockSettings,
        maxTicketsPerBooking: 8,
      }

      const state = reducer(
        { ...defaultSettingsState, saveStatus: 'loading' },
        updateSettings.fulfilled(updatedSettings, '', updatedSettings)
      )

      expect(state.saveStatus).toBe('succeeded')
      expect(state.data).toEqual(updatedSettings)
    })

    it('stores save error when rejected', () => {
      const state = reducer(
        { ...defaultSettingsState, saveStatus: 'loading' },
        updateSettings.rejected(
          new Error('Failed to update settings'),
          '',
          mockSettings
        )
      )

      expect(state.saveStatus).toBe('failed')
      expect(state.saveError).toBe('Failed to update settings')
    })
  })
})

describe('settingsSlice thunks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  function createTestStore() {
    return configureStore({
      reducer: { settings: reducer },
    })
  }

  describe('fetchSettings', () => {
    it('fetches settings from the API', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSettings,
      } as Response)

      const store = createTestStore()
      await store.dispatch(fetchSettings())

      expect(fetch).toHaveBeenCalledWith('/settings')
      expect(store.getState().settings).toEqual({
        ...defaultSettingsState,
        data: mockSettings,
      })
    })

    it('marks fetch as failed when the API returns an error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const store = createTestStore()
      await store.dispatch(fetchSettings())

      expect(store.getState().settings.status).toBe('failed')
      expect(store.getState().settings.error).toBe('Failed to fetch settings')
    })
  })

  describe('updateSettings', () => {
    it('posts settings to the API', async () => {
      const updatedSettings = {
        ...mockSettings,
        maxTicketsPerBooking: 8,
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedSettings,
      } as Response)

      const store = createTestStore()
      await store.dispatch(updateSettings(updatedSettings))

      expect(fetch).toHaveBeenCalledWith('/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      })
      expect(store.getState().settings).toEqual({
        ...defaultSettingsState,
        data: updatedSettings,
        saveStatus: 'succeeded',
      })
    })

    it('marks save as failed when the API returns an error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const store = createTestStore()
      await store.dispatch(updateSettings(mockSettings))

      expect(store.getState().settings.saveStatus).toBe('failed')
      expect(store.getState().settings.saveError).toBe(
        'Failed to update settings'
      )
    })
  })
})
