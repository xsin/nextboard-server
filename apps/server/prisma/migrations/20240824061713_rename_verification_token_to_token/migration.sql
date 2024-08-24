/*
  Warnings:

  - You are about to drop the column `expires` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the `authenticators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiredAt` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nextboard"."authenticators" DROP CONSTRAINT "authenticators_user_id_fkey";

-- AlterTable
ALTER TABLE "nextboard"."sessions" DROP COLUMN "expires",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "nextboard"."authenticators";

-- DropTable
DROP TABLE "nextboard"."verification_tokens";

-- CreateTable
CREATE TABLE "nextboard"."tokens" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_owner_code_key" ON "nextboard"."tokens"("owner", "code");
