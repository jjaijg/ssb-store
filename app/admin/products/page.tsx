import { auth } from "@/auth";
import { getAllProductsWithVariants } from "@/lib/actions/product.actions";
import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import ProductsTable from "./ProductsTable";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import CreateProduct from "./CreateProduct";

type Props = {};

const ProductsPage = async (props: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  //   Fecth categories and brands from the database
  const { brands = [] } = await getAllBrandsAction();
  const { categories = [] } = await getAllCategoriesAction();

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
      <CreateProduct categories={categories} brands={brands} />
    </Box>
  );
};

export default ProductsPage;
