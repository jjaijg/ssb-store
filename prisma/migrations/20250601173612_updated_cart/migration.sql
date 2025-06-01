-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Cart_sessioncartId_idx" ON "Cart"("sessioncartId");
