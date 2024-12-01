/*
  Warnings:

  - Added the required column `description` to the `ReviewResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReviewResponse" ADD COLUMN     "description" TEXT NOT NULL;
