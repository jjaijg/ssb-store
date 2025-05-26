"use client";

import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Brand } from "@prisma/client";
import BrandFormModal from "./BrandFormModal";

type Props = {
  brand: Brand;
};

function EditBrand({ brand }: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <BrandFormModal
        mode="edit"
        id={brand.id}
        brand={brand}
        open={open}
        handleClose={handleClose}
      />
      <IconButton
        color="primary"
        aria-label="edit brand"
        onClick={() => setOpen(true)}
      >
        <EditIcon />
      </IconButton>
    </>
  );
}

export default EditBrand;
