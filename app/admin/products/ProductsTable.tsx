import { formatDateTiem, formatId } from "@/lib/utils";
import {
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Brand, Category, Product, ProductVariant } from "@prisma/client";
import Image from "next/image";
import React from "react";

type Props = {
  products: (Product & {
    category: Category;
    brand: Brand;
    variants: ProductVariant[];
  })[];
};

const ProductsTable = ({ products }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ maxWidth: "650" }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Is Featured</TableCell>
            <TableCell>Banner Image</TableCell>
            <TableCell>Variants</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.slug}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.brand.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>
                <Chip
                  label={product.status}
                  color={
                    product.status === "ACTIVE"
                      ? "success"
                      : product.status === "INACTIVE"
                      ? "error"
                      : "default"
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>{product.isFeatured ? "Yes" : "No"}</TableCell>
              <TableCell>
                {product.bannerImage ? (
                  <Image
                    src={product.bannerImage}
                    alt={`${product.name} Banner Image`}
                    width={100}
                    height={50}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>
              <TableCell>
                {product.variants.length > 0 ? (
                  <Chip
                    label={`${product.variants.length} Variants`}
                    size="small"
                    sx={{ margin: "2px" }}
                  />
                ) : (
                  <Chip label="No Variants" size="small" color="warning" />
                )}
              </TableCell>
              <TableCell>
                {/* Actions Buttons - Edit, Delete */}
                <Stack direction="row" spacing={1}></Stack>
              </TableCell>
            </TableRow>
          ))}
          {/* No data message */}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                No products available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductsTable;
