import { formatId } from "@/lib/utils";
import {
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Brand, Category, Product, ProductVariant } from "@prisma/client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import DeleteDialog from "@/components/delete-dialog";
import { deleteProductById } from "@/lib/actions/product.actions";
import { SerializedProductVariant } from "@/types";

type Props = {
  variants: SerializedProductVariant[];
};

const ProductVariantsTable = ({ variants }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: "650" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>sku</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Is Default</TableCell>
            <TableCell>Order Limit</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant.id}>
              <TableCell>{formatId(variant.id)}</TableCell>
              <TableCell>
                {variant.variantName}
                <br />
                <Chip
                  label={`${variant.value} ${variant.unit}`}
                  size="small"
                  color="secondary"
                />
              </TableCell>
              <TableCell>{variant.price}</TableCell>
              <TableCell>{variant.stock}</TableCell>
              <TableCell>{variant.sku}</TableCell>
              <TableCell>
                <Chip
                  label={variant.isActive ? "Active" : "Inactive"}
                  color={variant.isActive ? "success" : "error"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {variant.isDefault && (
                  <Chip
                    label={variant.isDefault ? "Yes" : "No"}
                    color={"primary"}
                    size="small"
                  />
                )}
              </TableCell>
              <TableCell>
                Minimum : {variant.minOrderQty || 1} <br />
                Maximum : {variant.maxOrderQty || "No Limit"}
              </TableCell>
              <TableCell>
                {variant.discountValue > 0 ? (
                  <Chip
                    label={`${variant.discountValue} ${
                      variant.discountType === "PERCENTAGE" ? "%" : "Rs"
                    } Off`}
                    size="small"
                    color="warning"
                  />
                ) : (
                  <Chip label="No Discount" size="small" color="default" />
                )}
              </TableCell>
              <TableCell>
                {variant.images.length > 0 ? (
                  <Stack direction="row" spacing={1}>
                    {variant.images.slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Variant Image ${index + 1}`}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover" }}
                      />
                    ))}
                    {variant.images.length > 3 && (
                      <Chip
                        label={`+${variant.images.length - 3}`}
                        size="small"
                        color="info"
                      />
                    )}
                  </Stack>
                ) : (
                  "No Images"
                )}
              </TableCell>
              <TableCell>
                {/* Actions Buttons - Edit, Delete */}
                <Stack direction="row" spacing={1}>
                  <IconButton
                    LinkComponent={Link}
                    href={`/admin/variants/edit/${variant.id}`}
                    color="primary"
                    aria-label="edit product variant"
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteDialog
                    action={deleteProductById}
                    id={variant.id}
                    message="Are you sure you want to delete this product variant? This action cannot be undone."
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
          {/* No data message */}
          {variants.length === 0 && (
            <TableRow>
              <TableCell colSpan={13} align="center">
                No product variants available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductVariantsTable;
