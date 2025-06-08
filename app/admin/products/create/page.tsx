import { auth } from "@/auth";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import { Box, Button, Typography } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import ProductForm from "../../../../components/shared/admin/products/ProductForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Product",
};

const ProductCreatePage = async () => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  //   Fecth categories and brands from the database
  const { brands = [] } = await getAllBrandsAction();
  const { categories = [] } = await getAllCategoriesAction();

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Back to product button */}
      <Button
        LinkComponent={Link}
        href={`/admin/products`}
        startIcon={<ArrowLeftIcon />}
        sx={{ mb: 2 }}
      >
        Back to products
      </Button>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>

      <ProductForm mode="create" brands={brands} categories={categories} />
    </Box>
  );
};

export default ProductCreatePage;
