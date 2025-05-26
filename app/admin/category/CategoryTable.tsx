import { formatDateTiem, formatId } from "@/lib/utils";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Category } from "@prisma/client";
import React from "react";
import DeleteDialog from "@/components/delete-dialog";
import { deleteCategoryAction } from "@/lib/actions/category.actions";
import EditCategory from "./EditCategory";

type Props = {
  categories: Category[];
};

const CategoryTable = ({ categories }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: "650" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Description</TableCell>
            {/* <TableCell>Updated By</TableCell> */}
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{formatId(category.id)}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              {/* <TableCell>{category.updatedby}</TableCell> */}
              <TableCell>
                {formatDateTiem(category.createdAt).dateTime}
              </TableCell>
              <TableCell>
                {formatDateTiem(category.createdAt).dateTime}
              </TableCell>
              <TableCell>
                {/* Actions Buttons - Edit, Delete */}
                <Stack direction="row" spacing={1}>
                  <EditCategory category={category} />
                  <DeleteDialog
                    action={deleteCategoryAction}
                    id={category.id}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {/* No data message */}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No categories available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
