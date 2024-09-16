/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `vcodes` table. All the data in the column will be lost.
  - Added the required column `expired_at` to the `vcodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "nextboard"."vcodes" DROP COLUMN "expiredAt",
ADD COLUMN     "expired_at" TIMESTAMP(3) NOT NULL;
