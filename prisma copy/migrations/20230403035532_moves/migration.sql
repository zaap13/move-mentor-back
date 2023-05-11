/*
  Warnings:

  - You are about to drop the column `order` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `piece` on the `Lesson` table. All the data in the column will be lost.
  - The `moves` column on the `Lesson` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `messages` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Lesson` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "order",
DROP COLUMN "piece",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "messages" JSONB NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "position" SET DATA TYPE TEXT,
DROP COLUMN "moves",
ADD COLUMN     "moves" TEXT[];
