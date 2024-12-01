/*
  Warnings:

  - You are about to drop the column `responseId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reviewResponseId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewId]` on the table `ReviewResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewId` to the `ReviewResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewResponseId_fkey";

-- DropIndex
DROP INDEX "Review_responseId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "responseId",
DROP COLUMN "reviewResponseId",
ADD COLUMN     "hasReply" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ReviewResponse" ADD COLUMN     "reviewId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReviewResponse_reviewId_key" ON "ReviewResponse"("reviewId");

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
