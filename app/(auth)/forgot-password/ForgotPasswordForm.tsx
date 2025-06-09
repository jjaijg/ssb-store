"use client";
import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    success: false,
    message: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
        }),
      });

      const data = await response.json();

      setResult({
        success: response.ok,
        message: data.message,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" width="100%" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6" align="center">
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          size="medium"
        />
        <Button type="submit" variant="contained" fullWidth loading={loading}>
          Send Reset Link
        </Button>

        {result.message && (
          <Typography
            variant="body2"
            color={result.success ? "success.main" : "error.main"}
            align="center"
          >
            {result.message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default ForgotPasswordForm;
