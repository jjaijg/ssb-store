import { auth } from "@/auth";
import { getAllCategoriesAction } from "@/lib/actions/category.actions";
import { Alert, Box, Typography } from "@mui/material";

import React from "react";
import CategoryTable from "./CategoryTable";
import CreateCategory from "./CreateCategory";

type Props = {};

const CategoryPage = async (props: Props) => {
  const session = await auth();

  // Check if the user is authenticated and has the ADMIN role
  if (session?.user.role !== "ADMIN") throw new Error("User is unauthorized");

  // Fetch categories from the database
  const { success, categories } = await getAllCategoriesAction();

  return (
    <Box component={"section"} width="100%" padding={2}>
      {/* Heading */}
      <Typography variant="h4" gutterBottom>
        Categories
      </Typography>
      {/* Information section */}
      {!success && (
        <Alert severity="error">
          Error fetching categories. Please try again later.
        </Alert>
      )}
      {/* Catergories list */}
      <CategoryTable categories={categories ?? []} />

      {/* Create Action Button */}
      <CreateCategory />
    </Box>
  );
};

export default CategoryPage;
