-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastPasswordReset" TIMESTAMP(3),
ADD COLUMN     "passwordAttempts" INTEGER NOT NULL DEFAULT 0;
