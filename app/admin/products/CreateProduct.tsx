"use client";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import ProductFormModal from "./ProductFormModal";
import { Brand, Category } from "@prisma/client";

type Props = {
  categories: Category[];
  brands: Brand[];
};

const CreateProduct = (props: Props) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ProductFormModal
        categories={props.categories}
        brands={props.brands}
        mode="create"
        open={open}
        handleClose={handleClose}
      />
      <Fab
        color="primary"
        aria-label="add product"
        size="medium"
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>
    </>
  );
};

export default CreateProduct;
