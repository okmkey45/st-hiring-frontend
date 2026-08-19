import { useEffect } from "react";
import { Box, CircularProgress, Alert, Typography, Grid, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchEvents } from "../../store/eventsSlice";
import { EventCard } from "./EventCard";

const EVENT_FIELDS = ["id", "name", "location", "date"] as const;
const PAGE_SIZE = 8;

export function EventsView() {
  const dispatch = useAppDispatch();
  const { data: events, meta, status, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(
      fetchEvents({
        page: 1,
        size: PAGE_SIZE,
        fields: [...EVENT_FIELDS],
      })
    );
  }, [dispatch]);

  const handleLoadMore = () => {
    if (meta?.nextPage == null) return;

    dispatch(
      fetchEvents({
        page: meta.nextPage,
        size: PAGE_SIZE,
        fields: [...EVENT_FIELDS],
      })
    );
  };

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
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center" }}>
        All Events
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={6} lg={4}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {meta?.nextPage != null && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            disabled={status === "loading"}
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
