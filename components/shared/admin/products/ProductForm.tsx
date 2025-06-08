"use client";
import { UploadButton } from "@/lib/uploadthing";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validationSchema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Brand, Category, Status } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";
import { toast } from "react-toastify";
import {
  createProductWithoutVariants,
  updateProductWithoutVariants,
} from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import { SerializedProduct } from "@/types";
import { deleteUploadThingFile } from "@/lib/actions/uploadthing.actions";
import { z } from "zod";

type Props = {
  categories: Category[];
  brands: Brand[];
} & (
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      id: string;
      product: SerializedProduct;
    }
);

type CreateProduct = z.infer<typeof createProductSchema>;
type UpdateProduct = z.infer<typeof updateProductSchema>;

type Formschema = {
  create: CreateProduct;
  edit: UpdateProduct;
};

const ProductForm = (props: Props) => {
  const { mode } = props;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm<Formschema[typeof mode]>({
    resolver: zodResolver(
      mode === "edit" ? updateProductSchema : createProductSchema
    ),
    defaultValues:
      mode === "edit"
        ? {
            id: props.product.id,
            name: props.product.name,
            slug: props.product.slug,
            description: props.product.description ?? "",
            categoryId: props.product.categoryId,
            brandId: props.product.brandId,
            isFeatured: Boolean(props.product.isFeatured),
            status: props.product.status,
            bannerImage: props.product.bannerImage ?? "",
          }
        : {
            name: "",
            slug: "",
            description: "",
            categoryId: "",
            brandId: "",
            isFeatured: false,
            status: Status.ACTIVE,
            bannerImage: "",
          },
    mode: "onChange",
  });

  const { setValue } = form;

  const name = watch("name");
  const bannerImage = watch("bannerImage");

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

  const handlebannerImageDelete = async () => {
    if (bannerImage) {
      // Delete the banner image from the server if needed
      await deleteUploadThingFile(bannerImage);
      // Clear the banner image
      form.setValue("bannerImage", "");
    }
  };

  const handleSubmit = async (data: unknown) => {
    if (isPending || !form.formState.isValid) return;
    startTransition(async () => {
      if (mode === "create") {
        const result = await createProductWithoutVariants(
          data as CreateProduct
        );
        if (result.success) {
          toast.success("Product created successfully!");
          router.push("/admin/products");
          form.reset();
        } else {
          toast.error(result.message || "Failed to create product");
        }
      } else if (mode === "edit") {
        const result = await updateProductWithoutVariants(
          props.id,
          data as UpdateProduct
        );
        if (result.success) {
          toast.success("Product updated successfully!");
          form.reset();
          router.push("/admin/products");
        } else {
          toast.error(result.message || "Failed to update product");
        }
      }
    });
  };

  return (
    <>
      <Box
        component={"form"}
        width={"100%"}
        mt={2}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Stack spacing={2}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="space-between"
          >
            <TextField
              fullWidth
              label="Product Name"
              type="text"
              {...form.register("name")}
              autoFocus
              required
              error={Boolean(form.formState.errors.name)}
              helperText={form.formState.errors.name?.message}
            />
            <TextField
              fullWidth
              label="Slug"
              type="text"
              {...form.register("slug")}
              autoComplete="off"
              required
              error={Boolean(form.formState.errors.slug)}
              helperText={form.formState.errors.slug?.message}
            />
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="space-between"
          >
            <FormControl fullWidth required>
              <InputLabel id="brand-label">Brand</InputLabel>
              <Controller
                name="brandId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="brand-label"
                    value={value}
                    onChange={onChange}
                    error={Boolean(form.formState.errors.brandId)}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    {props.brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {form.formState.errors.brandId && (
                <FormHelperText error>
                  {form.formState.errors.brandId.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="category-label"
                    value={value}
                    onChange={onChange}
                    error={Boolean(form.formState.errors.categoryId)}
                  >
                    <MenuItem value="" disabled>
                      <em>None</em>
                    </MenuItem>
                    {props.categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {form.formState.errors.categoryId && (
                <FormHelperText error>
                  {form.formState.errors.categoryId.message}
                </FormHelperText>
              )}
            </FormControl>
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="space-between"
          >
            <FormControl fullWidth required>
              <InputLabel id="status-label">Status</InputLabel>
              <Controller
                name="status"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="status-label"
                    value={value}
                    onChange={onChange}
                    error={Boolean(form.formState.errors.status)}
                  >
                    <MenuItem key={Status.ACTIVE} value={Status.ACTIVE}>
                      {Status.ACTIVE}
                    </MenuItem>
                    <MenuItem key={Status.INACTIVE} value={Status.INACTIVE}>
                      {Status.INACTIVE}
                    </MenuItem>
                    <MenuItem
                      key={Status.DISCONTINUED}
                      value={Status.DISCONTINUED}
                    >
                      {Status.DISCONTINUED}
                    </MenuItem>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <FormHelperText error>
                  {form.formState.errors.status.message}
                </FormHelperText>
              )}
            </FormControl>
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Controller
                  name={"isFeatured"}
                  control={form.control}
                  render={({ field: props }) => (
                    <Checkbox
                      {...props}
                      checked={props.value}
                      onChange={props.onChange}
                    />
                  )}
                />
              }
              label="Is Featured"
            />
          </Stack>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            type="text"
            {...form.register("description")}
          />
          <Box component={Paper} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Banner Image
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload a banner image for the product. Recommended sizes are
              600x300, 800x400, or 1200x600 pixels. The image will be displayed
              in the Landing page banners.
            </Typography>
            <UploadButton
              disabled={isPending || !!bannerImage}
              className="upload-button"
              endpoint={"imageUploader"}
              onClientUploadComplete={(res) => {
                // ClientUploadedFileData<{
                //     uploadedBy: string;
                // }></UploadButton>
                form.setValue("bannerImage", res[0].ufsUrl);
              }}
              onUploadError={(error) => {
                toast.error("Failed to upload image: " + error.message);
              }}
            />
            <Stack direction="row" spacing={1} mt={2}>
              {bannerImage && (
                <Box position={"relative"}>
                  <Image
                    src={bannerImage}
                    alt="Banner"
                    width={"1024"}
                    height={"300"}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  <IconButton
                    color="error"
                    onClick={handlebannerImageDelete}
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
              {!bannerImage && (
                <Typography variant="body2" color="textSecondary">
                  No banner image uploaded.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent={"flex-end"} spacing={1} mt={2}>
          <Button
            color="error"
            variant="outlined"
            disabled={isPending || form.formState.isSubmitting}
            onClick={() => router.back()}
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
        </Stack>
      </Box>
    </>
  );
};

export default ProductForm;
