-- DropIndex
DROP INDEX "Cart_sessioncartId_idx";

-- DropIndex
DROP INDEX "Cart_sessioncartId_isActive_key";

-- DropIndex
DROP INDEX "Cart_userId_idx";

-- CreateIndex
CREATE INDEX "Cart_sessioncartId_isActive_idx" ON "Cart"("sessioncartId", "isActive");

-- CreateIndex
CREATE INDEX "Cart_userId_isActive_idx" ON "Cart"("userId", "isActive");
