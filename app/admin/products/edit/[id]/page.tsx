import { auth } from "@/auth";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import { Box, Button, Typography } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import ProductForm from "../../../../../components/shared/admin/products/ProductForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product.actions";
import Link from "next/link";

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
        Edit Product
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
