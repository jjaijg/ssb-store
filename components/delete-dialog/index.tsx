"use client";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import React, { useState, useTransition } from "react";

type Props = {
  id: string;
  message?: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
};

const DeleteDialog = ({ id, message, action }: Props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState({ success: false, message: "" });

  const handleDelete = () => {
    startTransition(async () => {
      const result = await action(id);
      setResult(result);
      if (result.success) {
        setOpen(false);
      }
    });
  };

  return (
    <>
      <IconButton
        color="error"
        aria-label="delete"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure</DialogTitle>

        <DialogContent>
          {message || "This action cannot be undone. Do you want to proceed?"}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            color="primary"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            color="error"
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      {result.message && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={Boolean(result.message)}
          onClose={() => setResult({ success: false, message: "" })}
          message={result.message}
          autoHideDuration={5000}
        >
          <Alert
            onClose={() => setResult({ success: false, message: "" })}
            severity={result.success ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {result.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default DeleteDialog;
