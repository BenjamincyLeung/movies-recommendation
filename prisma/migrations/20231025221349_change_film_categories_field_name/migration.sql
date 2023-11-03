/*
  Warnings:

  - You are about to drop the column `films_id` on the `film_categories` table. All the data in the column will be lost.
  - Added the required column `film_id` to the `film_categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "film_categories" DROP CONSTRAINT "film_categories_films_id_fkey";

-- AlterTable
ALTER TABLE "film_categories" DROP COLUMN "films_id",
ADD COLUMN     "film_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "film_categories" ADD CONSTRAINT "film_categories_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
