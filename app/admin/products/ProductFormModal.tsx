"use client";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/category.actions";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validationSchema/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Brand, Category, Product, Status } from "@prisma/client";
import React, { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import slugify from "slugify";

type Props = {
  categories: Category[];
  brands: Brand[];
  open: boolean;
  handleClose: () => void;
} & (
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      id: string;
      product: Product;
    }
);

const ProductFormModal = (props: Props) => {
  const { open, mode, handleClose } = props;

  const [result, setResult] = useState({ success: false, message: "" });
  const [isPending, startTransition] = useTransition();

  const { watch, ...form } = useForm({
    defaultValues: {
      name: mode === "edit" ? props.product.name : "",
      slug: mode === "edit" ? props.product.slug : "",
      description: mode === "edit" ? props.product.description ?? "" : "",
      categoryId: mode === "edit" ? props.product.categoryId : "",
      brandId: mode === "edit" ? props.product.brandId : "",
      isFeatured: mode === "edit" ? props.product.isFeatured : false,
      status: mode === "edit" ? props.product.status : Status.ACTIVE,
    },
    resolver: zodResolver(
      mode === "create" ? createProductSchema : updateProductSchema
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
        aria-label="product form modal"
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
          {mode === "create" ? "Create" : "Edit"} Product
        </DialogTitle>
        <DialogContent>
          <Box component={"form"} width={"100%"} mt={2}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Product Name"
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
              </FormControl>
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
              </FormControl>
              <FormControlLabel
                control={<Checkbox {...form.register("isFeatured")} />}
                label="Is Featured"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
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

export default ProductFormModal;
