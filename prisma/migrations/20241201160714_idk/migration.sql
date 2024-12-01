/*
  Warnings:

  - You are about to drop the column `shippingAdressId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_shippingAdressId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingAdressId";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippindId_fkey" FOREIGN KEY ("shippindId") REFERENCES "ShippingAdress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
