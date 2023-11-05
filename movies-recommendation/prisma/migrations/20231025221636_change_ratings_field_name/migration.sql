/*
  Warnings:

  - You are about to drop the column `rate_user_id` on the `ratings` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_rate_user_id_fkey";

-- AlterTable
ALTER TABLE "ratings" DROP COLUMN "rate_user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
