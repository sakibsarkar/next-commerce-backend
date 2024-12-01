/*
  Warnings:

  - You are about to drop the column `reviewId` on the `ReviewResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[responseId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewResponseId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReviewResponse" DROP CONSTRAINT "ReviewResponse_reviewId_fkey";

-- DropIndex
DROP INDEX "ReviewResponse_reviewId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "responseId" TEXT,
ADD COLUMN     "reviewResponseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReviewResponse" DROP COLUMN "reviewId";

-- CreateIndex
CREATE UNIQUE INDEX "Review_responseId_key" ON "Review"("responseId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewResponseId_fkey" FOREIGN KEY ("reviewResponseId") REFERENCES "ReviewResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
