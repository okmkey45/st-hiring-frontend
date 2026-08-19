import { useEffect } from "react";
import { Box, CircularProgress, Alert, Typography, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchEvents } from "../../store/eventsSlice";
import { EventCard } from "./EventCard";

export function EventsView() {
  const dispatch = useAppDispatch();
  const { data: events, status, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: 1,
        size: 10,
        fields: ["id", "name", "location", "date"],
      })
    );
  }, [dispatch]);

  if (status === "loading" && events.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4, maxWidth: "430px" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ px: 2, textAlign: "center" }}>
        All Events
      </Typography>
      
      <Stack sx={{ mt: 2 }}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </Stack>
    </Box>
  );
}
