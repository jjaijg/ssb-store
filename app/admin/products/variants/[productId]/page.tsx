import { auth } from "@/auth";
import ProductVariantsTable from "@/components/shared/admin/products/ProductVariantsTable";
import { getProductVariantsByProductId } from "@/lib/actions/productVariant.actions";
import {
  Alert,
  Box,
  Breadcrumbs,
  Fab,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Home as HomeIcon } from "@mui/icons-material";
import Link from "next/link";
import React from "react";
import { getProductById } from "@/lib/actions/product.actions";

type Props = {
  params: Promise<{ productId: string }>;
};

const ProductVariantsPage = async ({ params }: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  const { productId } = await params;

  const product = await getProductById(productId);

  if (!product) throw new Error("Product not found");

  const { success, variants } = await getProductVariantsByProductId(productId);

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Back to product button */}
      {/* <Button
        LinkComponent={Link}
        href={`/admin/products`}
        startIcon={<ArrowLeftIcon />}
      >
        Back to products
      </Button> */}

      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="Breadcrumbs">
        <MuiLink component={Link} underline="hover" color="inherit" href="/">
          <HomeIcon />
        </MuiLink>
        <MuiLink
          component={Link}
          underline="hover"
          color="text.primary"
          href={`/admin/products`}
          aria-current="page"
        >
          products
        </MuiLink>
        <MuiLink
          component={Link}
          underline="none"
          color="text.primary"
          href={`#`}
          // aria-current="page"
        >
          {product.name}
        </MuiLink>
        <MuiLink
          component={Link}
          underline="hover"
          color="text.primary"
          href={`/admin/products/variants/${productId}`}
          aria-current="page"
        >
          Variants
        </MuiLink>
      </Breadcrumbs>
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
        href={`/admin/products/variants/${productId}/create`}
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
