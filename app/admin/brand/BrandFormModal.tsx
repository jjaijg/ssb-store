"use client";
import {
  createBrandAction,
  updateBrandAction,
} from "@/lib/actions/brand.actions";
import {
  createBrandSchema,
  updateBrandSchema,
} from "@/lib/validationSchema/brand.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Brand } from "@prisma/client";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import slugify from "slugify";

type Props = { open: boolean; handleClose: () => void } & (
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      id: string;
      brand: Brand;
    }
);

const BrandFormModal = (props: Props) => {
  const { open, mode, handleClose } = props;

  const [result, setResult] = useState({ success: false, message: "" });
  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm({
    defaultValues: {
      name: mode === "edit" ? props.brand.name : "",
      slug: mode === "edit" ? props.brand.slug : "",
      description: mode === "edit" ? props.brand.description ?? "" : "",
    },
    resolver: zodResolver(
      mode === "create" ? createBrandSchema : updateBrandSchema
    ),
  });

  const name = watch("name");

  useEffect(() => {
    form.setValue(
      "slug",
      slugify(name, {
        lower: true,
        strict: true,
      })
    );
  }, [form, name]);

  const handleSubmit = () => {
    setResult({ success: false, message: "" });
    if (isPending) return; // Prevent multiple submissions

    startTransition(async () => {
      const data = form.getValues();
      let result = {
        success: false,
        message: "",
      };
      // Here you would typically send the data to your API or perform some action
      if (mode === "create") {
        result = await createBrandAction(data);
      } else if (mode === "edit") {
        result = await updateBrandAction(props.id, data);
      }

      setResult(result);

      if (result.success) {
        form.reset();
        handleClose();
      }
    });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-label="brand form modal"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "90%", sm: "80%", md: "500px" },
              maxWidth: "500px",
            },
          },
        }}
      >
        <DialogTitle>{mode === "create" ? "Create" : "Edit"} Brand</DialogTitle>
        <DialogContent>
          <Box component={"form"} width={"100%"} mt={2}>
            {!result.success && result.message && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {result.message}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Brand Name"
                type="text"
                {...form.register("name")}
                autoFocus
                required
              />
              <TextField
                fullWidth
                label="Slug"
                type="text"
                {...form.register("slug")}
                autoComplete="off"
                required
              />
              <TextField
                fullWidth
                label="Description"
                type="text"
                {...form.register("description")}
              />
            </Stack>
            <DialogActions sx={{ px: 0, mt: 2 }}>
              <Button
                color="error"
                variant="outlined"
                disabled={isPending}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending}
                onClick={handleSubmit}
              >
                {isPending
                  ? "Submitting..."
                  : mode === "create"
                  ? "Create"
                  : "Update"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      {result.success && result.message && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={Boolean(result.message)}
          onClose={() => setResult({ success: false, message: "" })}
          message={result.message}
          autoHideDuration={5000}
        >
          <Alert
            onClose={() => setResult({ success: false, message: "" })}
            severity={"success"}
            sx={{ width: "100%" }}
          >
            {result.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default BrandFormModal;
