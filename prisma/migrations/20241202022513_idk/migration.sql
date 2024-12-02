/*
  Warnings:

  - You are about to drop the `ShopFollowers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShopFollowers" DROP CONSTRAINT "ShopFollowers_shopId_fkey";

-- DropForeignKey
ALTER TABLE "ShopFollowers" DROP CONSTRAINT "ShopFollowers_userId_fkey";

-- DropTable
DROP TABLE "ShopFollowers";

-- CreateTable
CREATE TABLE "ShopFollower" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShopFollower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopFollower_userId_shopId_key" ON "ShopFollower"("userId", "shopId");

-- AddForeignKey
ALTER TABLE "ShopFollower" ADD CONSTRAINT "ShopFollower_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopFollower" ADD CONSTRAINT "ShopFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
