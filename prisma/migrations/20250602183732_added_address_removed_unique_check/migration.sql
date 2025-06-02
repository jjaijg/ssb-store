-- DropIndex
DROP INDEX "addresses_type_idx";

-- DropIndex
DROP INDEX "addresses_userId_name_key";

-- CreateIndex
CREATE INDEX "addresses_userId_type_idx" ON "addresses"("userId", "type");
