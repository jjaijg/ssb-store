"use client";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/category.actions";
import { deleteUploadThingFile } from "@/lib/actions/uploadthing.actions";
import { UploadButton } from "@/lib/uploadthing";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validationSchema/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Category } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import slugify from "slugify";
import { z } from "zod";

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

type FormSchema = {
  create: z.infer<typeof createCategorySchema>;
  edit: z.infer<typeof updateCategorySchema>;
};

const CategoryFormModal = (props: Props) => {
  const { open, mode, handleClose } = props;

  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm<FormSchema[typeof mode]>({
    defaultValues: {
      id: mode === "edit" ? props.category.id : undefined,
      name: mode === "edit" ? props.category.name : "",
      slug: mode === "edit" ? props.category.slug : "",
      description: mode === "edit" ? props.category.description ?? "" : "",
      image: mode === "edit" ? props.category.image ?? undefined : undefined,
    },
    resolver: zodResolver(
      mode === "create" ? createCategorySchema : updateCategorySchema
    ),
  });

  const { setValue } = form;

  const name = watch("name");
  const catImage = watch("image");

  useEffect(() => {
    setValue(
      "slug",
      slugify(name, {
        lower: true,
        strict: true,
      }),
      { shouldValidate: true }
    );
  }, [setValue, name]);

  const handleCategoryImageDelete = async () => {
    if (catImage) {
      // Delete the banner image from the server if needed
      await deleteUploadThingFile(catImage);
      // Clear the banner image
      setValue("image", "");
    }
  };

  const handleSubmit = async (data: unknown) => {
    if (isPending) return;
    if (!form.formState.isValid) return;

    startTransition(async () => {
      let result = {
        success: false,
        message: "",
      };
      // Here you would typically send the data to your API or perform some action
      if (mode === "create") {
        result = await createCategoryAction(
          data as z.infer<typeof createCategorySchema>
        );
      } else if (mode === "edit") {
        result = await updateCategoryAction(
          props.id,
          data as z.infer<typeof updateCategorySchema>
        );
      }

      if (!result.success) toast.error(result.message);
      if (result.success) {
        toast.success(result.message);
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
          <Box
            component={"form"}
            width={"100%"}
            mt={2}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Category Name"
                type="text"
                {...form.register("name")}
                autoFocus
                required
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message}
              />
              <TextField
                fullWidth
                label="Slug"
                type="text"
                {...form.register("slug")}
                autoComplete="off"
                required
                error={!!form.formState.errors.slug}
                helperText={form.formState.errors.slug?.message}
              />
              <TextField
                fullWidth
                label="Description"
                type="text"
                {...form.register("description")}
              />
              <Box component={Paper} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Category Image
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Upload a category image. Recommended sizes are 200x200,
                  300x300 or 400x400 pixels. The image will be displayed in the
                  featured categories.
                </Typography>
                <UploadButton
                  disabled={isPending || !!catImage}
                  className="upload-button"
                  endpoint={"imageUploader"}
                  onClientUploadComplete={(res) => {
                    // ClientUploadedFileData<{
                    //     uploadedBy: string;
                    // }></UploadButton>
                    setValue("image", res[0].ufsUrl, {
                      shouldValidate: true,
                    });
                  }}
                  onUploadError={(error) => {
                    toast.error("Failed to upload image: " + error.message);
                  }}
                />
                <Stack direction="row" spacing={1} mt={2}>
                  {catImage && (
                    <Box position={"relative"}>
                      <Image
                        src={catImage}
                        alt="Category Image"
                        width={"300"}
                        height={"300"}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                      <IconButton
                        color="error"
                        onClick={handleCategoryImageDelete}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                  {!catImage && (
                    <Typography variant="body2" color="textSecondary">
                      No category image uploaded.
                    </Typography>
                  )}
                </Stack>
              </Box>
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
    </>
  );
};

export default CategoryFormModal;
