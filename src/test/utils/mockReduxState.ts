import { vi } from 'vitest'
import type { RootState } from '../../store'
import type { SettingsState } from '../../store/settingsSlice'
import type { EventsState } from '../../store/eventsSlice'
import { defaultSettingsState } from '../fixtures/settings'
import { defaultEventsState } from '../fixtures/events'
import { reduxMocks } from '../mocks/reduxHooks'

type MockRootState = {
  settings?: Partial<SettingsState>
  events?: Partial<EventsState>
}

export function setMockReduxState(state: MockRootState = {}) {
  const rootState: RootState = {
    settings: { ...defaultSettingsState, ...state.settings },
    events: { ...defaultEventsState, ...state.events },
  }

  reduxMocks.mockUseAppSelector.mockImplementation((selector) =>
    selector(rootState)
  )
}

export function resetReduxMocks() {
  vi.clearAllMocks()
  reduxMocks.mockDispatch.mockImplementation((action) => action)
}
