/*
  Warnings:

  - Added the required column `shippindId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAdressId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ON_SHIPMENT', 'SHIPPED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippindId" TEXT NOT NULL,
ADD COLUMN     "shippingAdressId" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "ShippingAdress" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "detailed_address" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShippingAdress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShippingAdress" ADD CONSTRAINT "ShippingAdress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingAdressId_fkey" FOREIGN KEY ("shippingAdressId") REFERENCES "ShippingAdress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
