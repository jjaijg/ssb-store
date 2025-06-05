import { auth } from "@/auth";
import { getAllProductsWithVariants } from "@/lib/actions/product.actions";
import { Alert, Box, Fab, Typography } from "@mui/material";
import React from "react";
import ProductsTable from "../../../components/shared/admin/products/ProductsTable";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products - Admin",
  description: "Manage products in the admin panel",
};

const ProductsPage = async () => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  // Fetch products from the database
  const { success, products } = await getAllProductsWithVariants();

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      {/* Information section */}
      {!success && (
        <Alert severity="error">
          Error fetching products. Please try again later.
        </Alert>
      )}
      {/* products list */}
      <ProductsTable products={products ?? []} />
      {/* Create Action Button */}
      <Fab
        LinkComponent={Link}
        href="/admin/products/create"
        color="primary"
        aria-label="add product"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
        }}
        title="Create Product"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ProductsPage;
