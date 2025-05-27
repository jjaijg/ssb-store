import { auth } from "@/auth";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import { Box, Typography } from "@mui/material";
import ProductForm from "../../../../../components/shared/admin/products/ProductForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product.actions";

export const metadata: Metadata = {
  title: "Edit Product",
};

type Props = {
  params: Promise<{ id: string }>;
};

const ProductUpdatePage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  const { id } = await params;

  const product = await getProductById(id);

  if (!product) notFound();

  //  Fecth categories and brands from the database
  const { brands = [] } = await getAllBrandsAction();
  const { categories = [] } = await getAllCategoriesAction();

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>

      <ProductForm
        mode="edit"
        brands={brands}
        categories={categories}
        product={product}
        id={id}
      />
    </Box>
  );
};

export default ProductUpdatePage;
