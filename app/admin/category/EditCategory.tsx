"use client";

import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import CategoryFormModal from "./CategoryFormModal";
import { Category } from "@prisma/client";

type Props = {
  category: Category;
};

function EditCategory({ category }: Props) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CategoryFormModal
        mode="edit"
        id={category.id}
        category={category}
        open={open}
        handleClose={handleClose}
      />
      <IconButton
        color="primary"
        aria-label="edit category"
        onClick={() => setOpen(true)}
      >
        <EditIcon />
      </IconButton>
    </>
  );
}

export default EditCategory;
