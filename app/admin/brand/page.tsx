import { auth } from "@/auth";
import { Alert, Box, Typography } from "@mui/material";

import React from "react";
import BrandTable from "./BrandTable";
import CreateBrand from "./CreateBrand";
import { getAllBrandsAction } from "@/lib/actions/brand.actions";

const BrandPage = async () => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  // Fetch categories from the database
  const { success, brands } = await getAllBrandsAction();

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Brands
      </Typography>
      {/* Information section */}
      {!success && (
        <Alert severity="error">
          Error fetching brands. Please try again later.
        </Alert>
      )}
      {/* Catergories list */}
      <BrandTable brands={brands ?? []} />

      {/* Create Action Button */}
      <CreateBrand />
    </Box>
  );
};

export default BrandPage;
