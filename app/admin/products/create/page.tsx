import { auth } from "@/auth";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import { Box, Typography } from "@mui/material";
import ProductForm from "../../../../components/shared/admin/products/ProductForm";
import { Metadata } from "next";

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
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>

      <ProductForm mode="create" brands={brands} categories={categories} />
    </Box>
  );
};

export default ProductCreatePage;
