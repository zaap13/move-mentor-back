-- CreateEnum
CREATE TYPE "UserColor" AS ENUM ('w', 'b');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "moves" JSONB,
ADD COLUMN     "userColor" "UserColor",
ALTER COLUMN "position" DROP NOT NULL;
