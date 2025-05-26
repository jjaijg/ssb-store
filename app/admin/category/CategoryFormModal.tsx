"use client";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/category.actions";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validationSchema/category.schema";
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
import { Category } from "@prisma/client";
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
      category: Category;
    }
);

const CategoryFormModal = (props: Props) => {
  const { open, mode, handleClose } = props;

  const [result, setResult] = useState({ success: false, message: "" });
  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm({
    defaultValues: {
      name: mode === "edit" ? props.category.name : "",
      slug: mode === "edit" ? props.category.slug : "",
      description: mode === "edit" ? props.category.description ?? "" : "",
    },
    resolver: zodResolver(
      mode === "create" ? createCategorySchema : updateCategorySchema
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
  }, [name]);

  const handleSubmit = () => {
    startTransition(async () => {
      const data = form.getValues();
      let result = {
        success: false,
        message: "",
      };
      // Here you would typically send the data to your API or perform some action
      if (mode === "create") {
        result = await createCategoryAction(data);
      } else if (mode === "edit") {
        result = await updateCategoryAction(props.id, data);
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
        aria-label="category form modal"
        slotProps={{
          paper: {
            sx: {
              width: { xs: "90%", sm: "80%", md: "500px" },
              maxWidth: "500px",
            },
          },
        }}
      >
        <DialogTitle>
          {mode === "create" ? "Create" : "Edit"} Category
        </DialogTitle>
        <DialogContent>
          <Box component={"form"} width={"100%"} mt={2}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Category Name"
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
                helperText="Slug will be auto-generated if left empty."
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

export default CategoryFormModal;
