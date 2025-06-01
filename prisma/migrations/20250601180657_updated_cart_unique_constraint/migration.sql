/*
  Warnings:

  - A unique constraint covering the columns `[sessioncartId,isActive]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cart_sessioncartId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessioncartId_isActive_key" ON "Cart"("sessioncartId", "isActive");
