/*
  Warnings:

  - Added the required column `piece` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "piece" TEXT NOT NULL,
ADD COLUMN     "position" JSONB NOT NULL;
