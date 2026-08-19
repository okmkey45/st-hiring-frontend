import { Box, Card, CardContent, Typography } from "@mui/material";
import type { Event } from "../../types/events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date);

  const monthDay = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 1,
        border: "none",
        boxShadow: 2,
        backgroundColor: "background.paper",
        transition: "background-color 150ms ease, box-shadow 150ms ease",
        "&:hover": {
          backgroundColor: "action.hover",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ display: "flex", justifyContent: "center", px: 2, py: 2.5 }}>
        <Box sx={{ display: "flex", gap: 4, width: "100%" }}>
          <Box sx={{ width: 100, flexShrink: 0 }}>
            <Typography fontWeight={700} color="text.primary" lineHeight={1.2}>
              {monthDay}
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.3}>
              {weekday} · {time}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontWeight={700} color="text.primary" lineHeight={1.2}>
              {event.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" lineHeight={1.3}>
              {event.location}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
