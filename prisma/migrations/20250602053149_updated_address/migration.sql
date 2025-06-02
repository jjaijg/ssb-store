/*
  Warnings:

  - Added the required column `door` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "door" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT;
