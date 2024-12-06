-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "isBlackListed" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeleted" BOOLEAN DEFAULT false,
ADD COLUMN     "isSuspended" BOOLEAN DEFAULT false,
ADD COLUMN     "suspensionDate" BOOLEAN;
