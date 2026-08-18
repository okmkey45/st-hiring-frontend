import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Settings } from "../types/settings";

export const fetchSettings = createAsyncThunk<Settings, void, { rejectValue: string }>(
  "settings/fetch",
  async () => {
    const response = await fetch("/settings");

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    return (await response.json()) as Settings;
  },
);

export const updateSettings = createAsyncThunk<Settings, Settings, { rejectValue: string }>(
  "settings/update",
  async (settings: Settings) => {
    const response = await fetch("/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to update settings");
    }

    return (await response.json()) as Settings;
  },
);

export interface SettingsState {
  data: Settings | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  saveStatus: "idle" | "loading" | "failed" | "succeeded";
  saveError: string | null;
}

const initialState: SettingsState = {
  data: null,
  status: "idle",
  error: null,
  saveStatus: "idle",
  saveError: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSaveStatus: (state) => {
      state.saveStatus = "idle";
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch settings";
      })
      .addCase(updateSettings.pending, (state) => {
        state.saveStatus = "loading";
        state.saveError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError =
          action.error.message ?? "Failed to update settings";
      });
  },
});

export const { resetSaveStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
