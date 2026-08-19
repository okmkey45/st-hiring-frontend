import { useEffect } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
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
          minHeight: { xs: 280, sm: 360 },
          py: 6,
          px: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed" && !data) {
    return (
      <Box sx={{ py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ maxWidth: 560, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
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
    <Box
      sx={{
        py: { xs: 3, sm: 5, md: 6 },
        px: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 520, md: 560 },
          p: { xs: 2.5, sm: 4 },
          borderRadius: { xs: 2, sm: 3 },
          border: 1,
          borderColor: "divider",
          boxShadow: {
            xs: "none",
            sm: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mb: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
            aria-hidden
          >
            <SettingsOutlinedIcon fontSize="small" />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.35rem", sm: "1.5rem" },
              }}
            >
              Settings
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, lineHeight: 1.5 }}
            >
              Configure booking limits and fees.
            </Typography>
          </Box>
        </Box>

        <SettingsForm
          initialValues={data}
          onSubmit={handleSubmit}
          isSaving={saveStatus === "loading"}
          saveStatus={saveStatus}
          saveError={saveError}
        />
      </Paper>
    </Box>
  );
}
