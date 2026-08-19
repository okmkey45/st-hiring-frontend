import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./settingsSlice";
import eventsReducer from "./eventsSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
