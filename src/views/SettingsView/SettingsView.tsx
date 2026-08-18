import { useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchSettings,
  resetSaveStatus,
  updateSettings,
} from "../../store/settingsSlice";
import type { Settings } from "../../types/settings";
import { SettingsForm } from "./SettingsForm";

export function SettingsView() {
  const dispatch = useAppDispatch();
  const { data, status, error, saveStatus, saveError } = useAppSelector(
    (state) => state.settings,
  );

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  if (status === "loading" && !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed" && !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 2, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  const handleSubmit = async (values: Settings) => {
    dispatch(resetSaveStatus());
    await dispatch(
      updateSettings({
        maxTicketsPerBooking: Number(values.maxTicketsPerBooking),
        bookingTimeoutMinutes: Number(values.bookingTimeoutMinutes),
        serviceFeePercentage: Number(values.serviceFeePercentage),
      }),
    );
  };

  return (
    <Container maxWidth="sm" disableGutters>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure booking limits and fees.
        </Typography>

        <SettingsForm
          initialValues={data}
          onSubmit={handleSubmit}
          isSaving={saveStatus === "loading"}
          saveStatus={saveStatus}
          saveError={saveError}
        />
      </Paper>
    </Container>
  );
}
