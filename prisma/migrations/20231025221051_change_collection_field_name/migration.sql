/*
  Warnings:

  - You are about to drop the column `films_id` on the `collection` table. All the data in the column will be lost.
  - Added the required column `film_id` to the `collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collection" DROP CONSTRAINT "collection_films_id_fkey";

-- AlterTable
ALTER TABLE "collection" DROP COLUMN "films_id",
ADD COLUMN     "film_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
