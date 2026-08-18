import { Box, Container, Typography } from "@mui/material";

export function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{ mt: "auto", py: 2, borderTop: 1, borderColor: "divider" }}
    >
      <Container maxWidth="lg">
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Eventim. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
