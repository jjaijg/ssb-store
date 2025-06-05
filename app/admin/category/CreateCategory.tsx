"use client";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import CategoryFormModal from "./CategoryFormModal";

const CreateCategory = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CategoryFormModal mode="create" open={open} handleClose={handleClose} />
      <Fab
        color="primary"
        aria-label="add category"
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

export default CreateCategory;
