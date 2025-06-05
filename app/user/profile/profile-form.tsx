"use client";
import { Alert, Box, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/validationSchema/user.schema";
import { z } from "zod";
import { updateProfileAction } from "@/lib/actions/user.actions";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const [result, setResult] = useState({
    success: false,
    message: "",
  });
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user.name ?? "",
      email: session?.user.email ?? "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfileAction(data);
    if (res?.success) {
      // update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });
    }
    setResult({
      ...res,
    });
  };

  return (
    <>
      <Box
        component={"form"}
        width={"100%"}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Stack spacing={2}>
          <TextField
            type="email"
            label="Email"
            fullWidth
            {...form.register("email")}
            disabled
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email?.message}
          />
          <TextField
            type="name"
            label="Name"
            fullWidth
            {...form.register("name")}
            autoFocus
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "updating..." : "Update"}
          </Button>
        </Stack>
      </Box>
      {result.message && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={Boolean(result.message)}
          onClose={() => setResult({ success: false, message: "" })}
          message={result.message}
          autoHideDuration={5000}
        >
          <Alert
            onClose={() => setResult({ success: false, message: "" })}
            severity={result.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {result.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default ProfileForm;
