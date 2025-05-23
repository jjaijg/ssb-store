import { auth } from "@/auth";
import { Box, Card, CardHeader } from "@mui/material";
import React from "react";
import ProfileForm from "./profile-form";

type Props = {};

const UserProfilePage = async (props: Props) => {
  const session = await auth();
  return (
    <Card
      sx={{
        maxWidth: {
          xs: "100%",
          sm: "80%",
          md: "60%",
          lg: "50%",
        },
        margin: "auto",
        mt: 2,
        padding: 2,
      }}
    >
      <CardHeader title="User Profile" />
      <ProfileForm />
    </Card>
  );
};

export default UserProfilePage;
