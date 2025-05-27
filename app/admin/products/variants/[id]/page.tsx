import { auth } from "@/auth";
import ProductVariantsTable from "@/components/shared/admin/products/ProductVariantsTable";
import { getProductVariantsByProductId } from "@/lib/actions/productVariant.actions";
import { Alert, Box, Button, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import Link from "next/link";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const ProductVariantsPage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  const { id } = await params;

  const { success, variants } = await getProductVariantsByProductId(id);

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Back to product button */}
      <Button
        LinkComponent={Link}
        href={`/admin/products`}
        startIcon={<ArrowLeftIcon />}
      >
        Back to products
      </Button>
      {/* Heading */}
      <Typography variant="h4" gutterBottom mt={2}>
        {variants && variants.length > 0 ? variants[0].product.name : `Product`}{" "}
        - Variants
      </Typography>
      {/* Information section */}
      {!success && (
        <Alert severity="error">
          Error fetching product variants. Please try again later.
        </Alert>
      )}
      {/* products list */}
      <ProductVariantsTable variants={variants ?? []} />
      {/* Create Action Button */}
      <Fab
        LinkComponent={Link}
        href={`/admin/products/variants/${id}/create`}
        color="primary"
        aria-label="add product"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
        }}
        title="Create Product variant"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ProductVariantsPage;
