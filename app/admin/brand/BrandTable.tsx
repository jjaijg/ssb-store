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
import { Brand } from "@prisma/client";
import React from "react";
import DeleteDialog from "@/components/delete-dialog";
import EditBrand from "./EditBrand";
import { deleteBrandAction } from "@/lib/actions/brand.actions";

type Props = {
  brands: Brand[];
};

const BrandTable = ({ brands }: Props) => {
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
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>{formatId(brand.id)}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.slug}</TableCell>
              <TableCell>{brand.description}</TableCell>
              {/* <TableCell>{brand.updatedby}</TableCell> */}
              <TableCell>{formatDateTiem(brand.createdAt).dateTime}</TableCell>
              <TableCell>{formatDateTiem(brand.createdAt).dateTime}</TableCell>
              <TableCell>
                {/* Actions Buttons - Edit, Delete */}
                <Stack direction="row" spacing={1}>
                  <EditBrand brand={brand} />
                  <DeleteDialog action={deleteBrandAction} id={brand.id} />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {/* No data message */}
          {brands.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No brands available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BrandTable;
