import { Button } from "@mui/material";
import React from "react";
import { useFormStatus } from "react-dom";

const SigninButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" fullWidth disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
};

export default SigninButton;
