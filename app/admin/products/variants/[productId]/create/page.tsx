import { auth } from "@/auth";
import ProductVariantForm from "@/components/shared/admin/products/ProductVariantForm";
import { getProductById } from "@/lib/actions/product.actions";
import { Box, Button, Typography } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import Link from "next/link";
import React from "react";

type Props = {
  params: Promise<{ productId: string }>;
};

const VariantCreatePage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  // Get the product ID from the params
  const { productId } = await params;

  // get product by id
  const product = await getProductById(productId);

  if (!product) throw new Error("Product not found");

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Back to product button */}
      <Button
        LinkComponent={Link}
        href={`/admin/products/variants/${product.id}`}
        startIcon={<ArrowLeftIcon />}
        sx={{ mb: 2 }}
      >
        Back to variants
      </Button>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Create Variant of {product ? product.name : "Product"}
      </Typography>

      <ProductVariantForm mode="create" productId={productId} />
    </Box>
  );
};

export default VariantCreatePage;
