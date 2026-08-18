import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, TextField } from "@mui/material";
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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
                touched.maxTicketsPerBooking && errors.maxTicketsPerBooking
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />

            <TextField
              name="bookingTimeoutMinutes"
              label="Booking timeout (minutes)"
              type="number"
              value={values.bookingTimeoutMinutes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.bookingTimeoutMinutes &&
                Boolean(errors.bookingTimeoutMinutes)
              }
              helperText={
                touched.bookingTimeoutMinutes && errors.bookingTimeoutMinutes
              }
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />

            <TextField
              name="serviceFeePercentage"
              label="Service fee (%)"
              type="number"
              value={values.serviceFeePercentage}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.serviceFeePercentage &&
                Boolean(errors.serviceFeePercentage)
              }
              helperText={
                touched.serviceFeePercentage && errors.serviceFeePercentage
              }
              fullWidth
              inputProps={{ min: 0, max: 100, step: 0.01 }}
            />

            {saveStatus === "succeeded" && (
              <Alert severity="success">Settings saved successfully.</Alert>
            )}

            {saveStatus === "failed" && (
              <Alert severity="error">{saveError}</Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isSaving}
              sx={{ mt: 1 }}
            >
              {isSaving ? "Saving…" : "Save settings"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
