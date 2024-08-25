/*
  Warnings:

  - The primary key for the `logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "nextboard"."logs" DROP CONSTRAINT "logs_user_id_fkey";

-- AlterTable
ALTER TABLE "nextboard"."logs" DROP CONSTRAINT "logs_pkey",
ADD COLUMN     "is_system" BOOLEAN DEFAULT false,
ADD COLUMN     "user_email" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ADD CONSTRAINT "logs_pkey" PRIMARY KEY ("id");
