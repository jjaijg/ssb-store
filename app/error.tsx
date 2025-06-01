"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 8,
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: 64,
            color: "error.main",
            mb: 4,
          }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          Something went wrong!
        </Typography>

        <Typography color="text.secondary" paragraph>
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button onClick={() => reset()} variant="contained" size="large">
            Try Again
          </Button>
          <Button href="/" variant="outlined" size="large">
            Go to Homepage
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
