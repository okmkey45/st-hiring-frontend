import { vi } from 'vitest'
import type { RootState } from '../../store'
import type { SettingsState } from '../../store/settingsSlice'
import { defaultSettingsState } from '../fixtures/settings'
import { reduxMocks } from '../mocks/reduxHooks'

type MockRootState = {
  settings?: Partial<SettingsState>
}

export function setMockReduxState(state: MockRootState = {}) {
  const rootState: RootState = {
    settings: { ...defaultSettingsState, ...state.settings },
  }

  reduxMocks.mockUseAppSelector.mockImplementation((selector) =>
    selector(rootState)
  )
}

export function resetReduxMocks() {
  vi.clearAllMocks()
  reduxMocks.mockDispatch.mockImplementation((action) => action)
}
