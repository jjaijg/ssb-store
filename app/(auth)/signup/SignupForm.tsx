"use client";
import { signupAction } from "@/lib/actions/user.actions";
import {
  Box,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "next/link";
import React, { useActionState, useState } from "react";
import SignUpButton from "./SignUpButton";

const SignupForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [data, action] = useActionState(signupAction, {
    success: false,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form" width="100%" action={action}>
      <Stack spacing={2}>
        <TextField
          label="Name"
          name="name"
          type="text"
          fullWidth
          value={form.name}
          onChange={handleChange}
          required
          size="medium"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          value={form.email}
          onChange={handleChange}
          required
          size="medium"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={form.password}
          onChange={handleChange}
          required
          size="medium"
        />
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          fullWidth
          value={form.confirmPassword}
          onChange={handleChange}
          required
          size="medium"
        />
        <SignUpButton />
      </Stack>
      {data && !data.success && (
        <Typography variant="body2" color={"error"} align="center" mt={3}>
          {data.message}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" align="center" mt={3}>
        Already have an account?{" "}
        <MuiLink component={NextLink} href="/signin" underline="hover">
          Sign In
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default SignupForm;
