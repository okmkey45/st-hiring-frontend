import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import type { Settings } from "../../types/settings";

const validationSchema = Yup.object({
  maxTicketsPerBooking: Yup.number()
    .required("Required")
    .integer("Must be a whole number")
    .min(1, "Must be at least 1"),
  bookingTimeoutMinutes: Yup.number()
    .required("Required")
    .integer("Must be a whole number")
    .min(1, "Must be at least 1 minute"),
  serviceFeePercentage: Yup.number()
    .required("Required")
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100"),
});

interface SettingsFormProps {
  initialValues: Settings;
  onSubmit: (values: Settings) => Promise<void>;
  isSaving: boolean;
  saveStatus: "idle" | "loading" | "failed" | "succeeded";
  saveError: string | null;
}

export function SettingsForm({
  initialValues,
  onSubmit,
  isSaving,
  saveStatus,
  saveError,
}: SettingsFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form noValidate>
          <Stack spacing={{ xs: 2.5, sm: 3 }}>
            <TextField
              name="maxTicketsPerBooking"
              label="Max tickets per booking"
              type="number"
              value={values.maxTicketsPerBooking}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.maxTicketsPerBooking &&
                Boolean(errors.maxTicketsPerBooking)
              }
              helperText={
                (touched.maxTicketsPerBooking &&
                  errors.maxTicketsPerBooking) ||
                "Upper limit for a single checkout."
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">tickets</InputAdornment>
                ),
              }}
            />

            <TextField
              name="bookingTimeoutMinutes"
              label="Booking timeout"
              type="number"
              value={values.bookingTimeoutMinutes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.bookingTimeoutMinutes &&
                Boolean(errors.bookingTimeoutMinutes)
              }
              helperText={
                (touched.bookingTimeoutMinutes &&
                  errors.bookingTimeoutMinutes) ||
                "How long a held seat stays reserved."
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
            />

            <TextField
              name="serviceFeePercentage"
              label="Service fee"
              type="number"
              value={values.serviceFeePercentage}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.serviceFeePercentage &&
                Boolean(errors.serviceFeePercentage)
              }
              helperText={
                (touched.serviceFeePercentage &&
                  errors.serviceFeePercentage) ||
                "Added on top of the ticket subtotal."
              }
              fullWidth
              inputProps={{ min: 0, max: 100, step: 0.01 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
                ),
              }}
            />

            {saveStatus === "succeeded" && (
              <Alert severity="success">Settings saved successfully.</Alert>
            )}

            {saveStatus === "failed" && (
              <Alert severity="error">{saveError}</Alert>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
                pt: { xs: 0.5, sm: 1 },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSaving}
                startIcon={
                  isSaving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  minWidth: { sm: 160 },
                  px: { sm: 3 },
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {isSaving ? "Saving…" : "Save settings"}
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
