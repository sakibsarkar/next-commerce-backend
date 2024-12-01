-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_shopId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "shopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
