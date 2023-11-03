/*
  Warnings:

  - Added the required column `film_id` to the `choose3categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "choose3categories" ADD COLUMN     "film_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "choose3categories" ADD CONSTRAINT "choose3categories_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
