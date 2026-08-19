import { Outlet } from "react-router";
import { Box, Container } from "@mui/material";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function AppLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppHeader />

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, px: 0 }}>
        <Outlet />
      </Container>

      <AppFooter />
    </Box>
  );
}
