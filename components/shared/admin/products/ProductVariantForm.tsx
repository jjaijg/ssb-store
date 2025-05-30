"use client";
import { UploadButton } from "@/lib/uploadthing";
import {
  createProductVariantSchema,
  updateProductVariantSchema,
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
import { DiscountType } from "@prisma/client";
import Image from "next/image";
import React, { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SerializedProductVariant } from "@/types";
import { deleteUploadThingFile } from "@/lib/actions/uploadthing.actions";
import {
  createProductVariant,
  updateProductVariant,
} from "@/lib/actions/productVariant.actions";

type Props = {
  productId: string;
} & (
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      variant: SerializedProductVariant;
    }
);

const ProductVariantForm = (props: Props) => {
  const { productId, mode } = props;

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm({
    defaultValues: {
      variantName: mode === "edit" ? props.variant.variantName : "",
      value: mode === "edit" ? props.variant.value : 0,
      unit: mode === "edit" ? props.variant.unit : "",
      price: mode === "edit" ? props.variant.price : 0,
      stock: mode === "edit" ? props.variant.stock : 0,
      sku: mode === "edit" ? props.variant.sku : "",
      isActive: mode === "edit" ? props.variant.isActive : true,
      isDefault: mode === "edit" ? props.variant.isDefault : false,
      minOrderQty: mode === "edit" ? props.variant.minOrderQty : 1,
      maxOrderQty: mode === "edit" ? props.variant.maxOrderQty ?? 100 : 100,
      discountType:
        mode === "edit" ? props.variant.discountType : DiscountType.NONE,
      discountValue: mode === "edit" ? props.variant.discountValue ?? 0 : 0,
      images: mode === "edit" ? props.variant.images : [],
      productId: mode === "edit" ? props.variant.productId : productId,
    },
    resolver: zodResolver(createProductVariantSchema),
    mode: "onChange",
  });

  const images = watch("images");
  const isDefaultVariant = mode === "edit" && props.variant.isDefault;

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      // const data = form.getValues();
      // Here you would typically send the data to your API or perform some action
      if (mode === "create") {
        const result = await createProductVariant({
          ...data,
          isActive: !!data.isActive,
          isDefault: !!data.isDefault,
          discountType: data.discountType ?? DiscountType.NONE,
        });
        if (result.success) {
          toast.success("Product variant created successfully!");
          router.push(`/admin/products/variants/${productId}`);
          form.reset();
        } else {
          toast.error(result.message || "Failed to create product variant");
        }
      } else if (mode === "edit") {
        const result = await updateProductVariant(props.variant.id, {
          ...data,
          id: props.variant.id,
          isActive: !!data.isActive,
          isDefault: !!data.isDefault,
          discountType: data.discountType ?? DiscountType.NONE,
        });
        if (result.success) {
          toast.success("Product variant updated successfully!");
          form.reset();
          router.push(`/admin/products/variants/${productId}`);
        } else {
          toast.error(result.message || "Failed to update product variant");
        }
      }
    });
  });

  return (
    <>
      <Box component={"form"} width={"100%"} mt={2} onSubmit={onSubmit}>
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
              label="Variant Name"
              type="text"
              {...form.register("variantName")}
              autoFocus
              required
              error={Boolean(form.formState.errors.variantName)}
              helperText={form.formState.errors.variantName?.message}
            />
            <TextField
              fullWidth
              label="SKU"
              type="text"
              {...form.register("sku")}
              autoComplete="off"
              required
              error={Boolean(form.formState.errors.sku)}
              helperText={form.formState.errors.sku?.message}
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
            <TextField
              fullWidth
              label="Unit"
              type="text"
              {...form.register("unit")}
              required
              error={Boolean(form.formState.errors.unit)}
              helperText={form.formState.errors.unit?.message}
            />
            <TextField
              fullWidth
              label="Value"
              {...form.register("value")}
              autoComplete="off"
              required
              error={Boolean(form.formState.errors.value)}
              helperText={form.formState.errors.value?.message}
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
            <TextField
              fullWidth
              label="Price"
              {...form.register("price")}
              required
              error={Boolean(form.formState.errors.price)}
              helperText={form.formState.errors.price?.message}
            />
            <TextField
              fullWidth
              label="Stock"
              {...form.register("stock")}
              required
              error={Boolean(form.formState.errors.stock)}
              helperText={form.formState.errors.stock?.message}
            />
          </Stack>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            justifyContent="space-between"
            width={"100%"}
          >
            <FormControl
              error={Boolean(form.formState.errors.isActive)}
              fullWidth
            >
              <FormControlLabel
                control={
                  <Controller
                    name={"isActive"}
                    control={form.control}
                    render={({ field: fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        checked={fieldProps.value}
                        disabled={isDefaultVariant}
                        onChange={(e) => {
                          fieldProps.onChange(e);
                          form.trigger("isDefault");
                        }}
                      />
                    )}
                  />
                }
                label="Is Active"
              />
              {isDefaultVariant && (
                <FormHelperText>
                  This option is disbaled for default variant
                </FormHelperText>
              )}
            </FormControl>
            <FormControl
              error={Boolean(form.formState.errors.isDefault)}
              fullWidth
            >
              <FormControlLabel
                control={
                  <Controller
                    name={"isDefault"}
                    control={form.control}
                    render={({ field: fieldProps }) => (
                      <Checkbox
                        {...fieldProps}
                        checked={fieldProps.value}
                        disabled={isDefaultVariant}
                        onChange={fieldProps.onChange}
                      />
                    )}
                  />
                }
                label="Is Default Variant"
              />
              {isDefaultVariant && (
                <FormHelperText>
                  This option is disbaled for default variant
                </FormHelperText>
              )}

              {form.formState.errors.isDefault && (
                <FormHelperText error>
                  {form.formState.errors.isDefault.message}
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
            <TextField
              fullWidth
              label="Minimum Order Quantity"
              {...form.register("minOrderQty")}
              required
              error={Boolean(form.formState.errors.minOrderQty)}
              helperText={form.formState.errors.minOrderQty?.message}
            />
            <TextField
              fullWidth
              label="Maximum Order Quantity"
              {...form.register("maxOrderQty", {
                onChange: () => {
                  form.trigger("minOrderQty");
                },
              })}
              required
              error={Boolean(form.formState.errors.maxOrderQty)}
              helperText={form.formState.errors.maxOrderQty?.message}
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
            <FormControl fullWidth>
              <InputLabel id="discount-type-label">Discount Type</InputLabel>
              <Controller
                name="discountType"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="discount-type-label"
                    value={value ?? DiscountType.NONE}
                    onChange={(e) => {
                      onChange(e);
                      form.trigger("discountValue");
                    }}
                    error={Boolean(form.formState.errors.discountType)}
                  >
                    <MenuItem value={DiscountType.NONE}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={DiscountType.PERCENTAGE}>
                      {DiscountType.PERCENTAGE}
                    </MenuItem>
                    <MenuItem value={DiscountType.FIXED}>
                      {DiscountType.FIXED}
                    </MenuItem>
                  </Select>
                )}
              />
              {form.formState.errors.discountType && (
                <FormHelperText error>
                  {form.formState.errors.discountType.message}
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Discount Value"
              {...form.register("discountValue")}
              autoComplete="off"
              error={Boolean(form.formState.errors.discountValue)}
              helperText={form.formState.errors.discountValue?.message}
            />
          </Stack>

          <Box component={Paper} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Product Images
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Upload maximum of 5 product images. Recommended sizes are 150x300,
              200x300 pixels. The image will be displayed in the product card
              and product details page.
            </Typography>
            <UploadButton
              disabled={isPending || !!(images?.length >= 5)}
              className="upload-button"
              endpoint={"imageUploader"}
              onClientUploadComplete={(res) => {
                // ClientUploadedFileData<{
                //     uploadedBy: string;
                // }></UploadButton>
                form.setValue("images", [...images, res[0].ufsUrl]);
              }}
              onUploadError={(error) => {
                toast.error("Failed to upload image: " + error.message);
              }}
            />
            <Stack direction="row" spacing={2} mt={2}>
              {images &&
                images.map((img) => (
                  <Box position={"relative"} key={img}>
                    <Image
                      src={img}
                      alt="Banner"
                      width={"200"}
                      height={"300"}
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => {
                        const updatedImages = images.filter(
                          (image) => image !== img
                        );
                        form.setValue("images", updatedImages);
                        deleteUploadThingFile(img);
                      }}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        bgcolor: "white",
                        "&:hover": {
                          bgcolor: "white",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              {images.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  No product image uploaded.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent={"flex-end"} spacing={1} mt={2}>
          <Button
            color="error"
            variant="outlined"
            disabled={isPending}
            onClick={() => router.back()}
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
        </Stack>
      </Box>
    </>
  );
};

export default ProductVariantForm;
