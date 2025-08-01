"use client";
import {
  Box,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useState } from "react";
import SigninButton from "./SigninButton";
import { useRouter, useSearchParams } from "next/navigation";
import { signinFormSchema } from "@/lib/validationSchema/user.schema";
import { signIn } from "next-auth/react";

const SigninForm = () => {
  const [result, setResult] = useState({
    success: false,
    message: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setResult({
      success: false,
      message: "",
    });
    // Call the action function
    try {
      // Validate the form data using the schema
      const user = signinFormSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      // Sign in the user
      const resp = await signIn("credentials", {
        ...user,
        redirect: false,
      });
      setResult({
        success: !resp?.error,
        message: !resp?.error ? "Sign in successful" : "Invalid credentials",
      });
      if (resp?.ok && !resp.error) router.push(callbackUrl);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setResult({
        success: false,
        message: "Invalid credentials",
      });
    }
  };

  return (
    <Box component="form" width="100%" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          required
          size="medium"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          required
          size="medium"
        />
        <SigninButton />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <MuiLink
            component={NextLink}
            href="/forgot-password"
            underline="hover"
            variant="body2"
          >
            Forgot Password?
          </MuiLink>
        </Box>

        {!result.success && result.message && (
          <Typography
            variant="body2"
            color={result.success ? "success" : "error"}
            align="center"
            mt={3}
          >
            {result.message}
          </Typography>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" align="center" mt={3}>
        Don&apos;t have an account?{" "}
        <MuiLink component={NextLink} href="/signup" underline="hover">
          Sign Up
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default SigninForm;
