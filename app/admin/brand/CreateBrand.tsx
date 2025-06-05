"use client";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import BrandFormModal from "./BrandFormModal";

const CreateBrand = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <BrandFormModal mode="create" open={open} handleClose={handleClose} />
      <Fab
        color="primary"
        aria-label="add brand"
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

export default CreateBrand;
