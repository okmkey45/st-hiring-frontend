import { useParams } from "react-router";
import { Box, Typography } from "@mui/material";

export function EventView() {
  const { eventId } = useParams<{ eventId: string }>();

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Event {eventId}
      </Typography>
      <Typography color="text.secondary">
        Event details coming soon.
      </Typography>
    </Box>
  );
}
