-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "isSale" SET DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ShopFollowers" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ShopFollowers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopFollowers_userId_shopId_key" ON "ShopFollowers"("userId", "shopId");

-- AddForeignKey
ALTER TABLE "ShopFollowers" ADD CONSTRAINT "ShopFollowers_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopFollowers" ADD CONSTRAINT "ShopFollowers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
