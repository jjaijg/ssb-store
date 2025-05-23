import { Button } from "@mui/material";
import React from "react";
import { useFormStatus } from "react-dom";

const SignUpButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" fullWidth disabled={pending}>
      {pending ? "Signing up..." : "Sign Up"}
    </Button>
  );
};

export default SignUpButton;
