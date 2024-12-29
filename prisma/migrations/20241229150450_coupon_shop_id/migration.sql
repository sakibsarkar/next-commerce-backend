/*
  Warnings:

  - Added the required column `shopId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "shopId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
