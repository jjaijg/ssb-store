"use client";
import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    success: false,
    message: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setResult({
        success: false,
        message: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      setResult({
        success: response.ok,
        message: data.message,
      });

      if (response.ok) {
        // Redirect to signin page after successful password reset
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }
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

  if (!token) {
    return (
      <Typography color="error" align="center">
        Invalid reset link. Please request a new password reset.
      </Typography>
    );
  }

  return (
    <Box component="form" width="100%" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h6" align="center">
          Reset Your Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Please enter your new password.
        </Typography>
        <TextField
          label="New Password"
          name="password"
          type="password"
          fullWidth
          required
          size="medium"
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          required
          size="medium"
        />
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          Reset Password
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

export default ResetPasswordForm;
