import { Box, Typography, Paper } from "@mui/material";
import Image from "next/image";
import SignupForm from "./SignupForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Signup`,
};

type Props = {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
};

const SignupPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  // Check if the user is already authenticated
  // If authenticated, redirect to the callback URL or home page
  if (session) redirect(callbackUrl || "/");

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 480,
          maxWidth: "90vw",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box mb={2}>
          <Image
            priority
            src="/images/logo.webp"
            alt="SSB Logo"
            width={130}
            height={130}
            style={{
              borderRadius: 12,
              border: "1px solid #ddd",
              padding: 10,
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>
        <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
          Sign Up
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mb={2}
        >
          Enter you information below to sign up
        </Typography>
        <SignupForm />
      </Paper>
    </Box>
  );
};

export default SignupPage;
