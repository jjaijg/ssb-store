/*
  Warnings:

  - A unique constraint covering the columns `[sessioncartId,userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessioncartId_userId_key" ON "Cart"("sessioncartId", "userId");
