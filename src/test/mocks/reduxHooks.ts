import { vi } from 'vitest'

export const reduxMocks = {
  mockDispatch: vi.fn(),
  mockUseAppSelector: vi.fn(),
}

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => reduxMocks.mockDispatch,
  useAppSelector: (selector: (state: unknown) => unknown) =>
    reduxMocks.mockUseAppSelector(selector),
}))
