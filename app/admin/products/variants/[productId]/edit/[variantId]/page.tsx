import { auth } from "@/auth";
import ProductVariantForm from "@/components/shared/admin/products/ProductVariantForm";
import { getProductById } from "@/lib/actions/product.actions";
import { getProductVariantById } from "@/lib/actions/productVariant.actions";
import { Box, Button, Typography } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@mui/icons-material";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ productId: string; variantId: string }>;
};

const VariantEditPage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  // Get the product ID from the params
  const { productId, variantId } = await params;

  // get product by id
  const product = await getProductById(productId);
  if (!product) throw new Error("Product not found");

  // get variant by id
  const variant = await getProductVariantById(variantId);

  if (!variant) notFound();

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
        Edit Variant of {product ? product.name : "Product"}
      </Typography>

      <ProductVariantForm mode="edit" productId={productId} variant={variant} />
    </Box>
  );
};

export default VariantEditPage;
