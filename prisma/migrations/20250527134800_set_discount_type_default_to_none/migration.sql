/*
  Warnings:

  - Made the column `discountType` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "discountType" SET NOT NULL,
ALTER COLUMN "discountType" SET DEFAULT 'NONE';
