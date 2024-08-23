/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "nextboard"."users" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT;
