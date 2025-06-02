/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_name_key" ON "addresses"("userId", "name");
