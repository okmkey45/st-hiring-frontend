import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PaginatedEvents, Event } from "../types/events";
import type { PaginationMeta } from "../types/pagination";

export interface FetchEventsParams {
  page?: number;
  size?: number;
  fields?: string[];
}

export const fetchEvents = createAsyncThunk<
  PaginatedEvents,
  FetchEventsParams | void,
  { rejectValue: string }
>("events/fetch", async (params) => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page !== undefined) queryParams.append("page", params.page.toString());
    if (params.size !== undefined) queryParams.append("size", params.size.toString());
    if (params.fields && params.fields.length > 0) queryParams.append("fields", params.fields.join(","));
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/events?${queryString}` : "/events";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return (await response.json()) as PaginatedEvents;
});

export interface EventsState {
  data: Event[];
  meta: PaginationMeta | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: EventsState = {
  data: [],
  meta: null,
  status: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "idle";
        const page = action.meta.arg?.page ?? 1;
        state.data =
          page > 1
            ? [...state.data, ...action.payload.data]
            : action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch events";
      });
  },
});

export default eventsSlice.reducer;
