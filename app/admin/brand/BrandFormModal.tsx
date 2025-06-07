"use client";
import {
  createBrandAction,
  updateBrandAction,
} from "@/lib/actions/brand.actions";
import { deleteUploadThingFile } from "@/lib/actions/uploadthing.actions";
import { UploadButton } from "@/lib/uploadthing";
import {
  createBrandSchema,
  updateBrandSchema,
} from "@/lib/validationSchema/brand.schema";
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
import { Brand } from "@prisma/client";
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
      brand: Brand;
    }
);

const BrandFormModal = (props: Props) => {
  const { open, mode, handleClose } = props;

  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm({
    defaultValues: {
      name: mode === "edit" ? props.brand.name : "",
      slug: mode === "edit" ? props.brand.slug : "",
      description: mode === "edit" ? props.brand.description ?? "" : "",
      logoUrl: mode === "edit" ? props.brand.logoUrl ?? "" : "",
    },
    resolver: zodResolver(
      mode === "create" ? createBrandSchema : updateBrandSchema
    ),
  });

  const { setValue } = form;

  const name = watch("name");
  const brandImage = watch("logoUrl");

  useEffect(() => {
    setValue(
      "slug",
      slugify(name, {
        lower: true,
        strict: true,
      }),
      {
        shouldValidate: true,
      }
    );
  }, [setValue, name]);

  const handleBrandImageDelete = async () => {
    if (brandImage) {
      // Delete the banner image from the server if needed
      await deleteUploadThingFile(brandImage);
      // Clear the banner image
      setValue("logoUrl", "", {
        shouldValidate: true,
      });
    }
  };

  const handleSubmit = async (data: unknown) => {
    if (isPending) return; // Prevent multiple submissions
    if (!form.formState.isValid) return;

    startTransition(async () => {
      let result = {
        success: false,
        message: "",
      };
      // Here you would typically send the data to your API or perform some action
      if (mode === "create") {
        result = await createBrandAction(
          data as z.infer<typeof createBrandSchema>
        );
      } else if (mode === "edit") {
        result = await updateBrandAction(
          props.id,
          data as z.infer<typeof updateBrandSchema>
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
          <Box
            component={"form"}
            width={"100%"}
            mt={2}
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Brand Name"
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
                  Brand Logo
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Upload a brand image. Recommended sizes are 200x200, 300x300
                  or 400x400 pixels. The image will be displayed in the brand
                  showcase.
                </Typography>
                <UploadButton
                  disabled={isPending || !!brandImage}
                  className="upload-button"
                  endpoint={"imageUploader"}
                  onClientUploadComplete={(res) => {
                    // ClientUploadedFileData<{
                    //     uploadedBy: string;
                    // }></UploadButton>
                    form.setValue("logoUrl", res[0].ufsUrl, {
                      shouldValidate: true,
                    });
                  }}
                  onUploadError={(error) => {
                    toast.error("Failed to upload image: " + error.message);
                  }}
                />
                <Stack direction="row" spacing={1} mt={2}>
                  {brandImage && (
                    <Box position={"relative"}>
                      <Image
                        src={brandImage}
                        alt="Banner"
                        width={"300"}
                        height={"300"}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                      <IconButton
                        color="error"
                        onClick={handleBrandImageDelete}
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
                  {!brandImage && (
                    <Typography variant="body2" color="textSecondary">
                      No brand image uploaded.
                    </Typography>
                  )}
                  {form.formState.errors.logoUrl && (
                    <Typography variant="body2" color="error">
                      {form.formState.errors.logoUrl.message}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
            <DialogActions sx={{ px: 0, mt: 2 }}>
              <Button
                color="error"
                variant="outlined"
                disabled={isPending || form.formState.isSubmitting}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending || form.formState.isSubmitting}
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

export default BrandFormModal;
