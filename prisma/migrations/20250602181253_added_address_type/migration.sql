-- CreateEnum
CREATE TYPE "ADDRESS_TYPE" AS ENUM ('SHIPPING', 'BILLING');

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "type" "ADDRESS_TYPE" NOT NULL DEFAULT 'SHIPPING';
