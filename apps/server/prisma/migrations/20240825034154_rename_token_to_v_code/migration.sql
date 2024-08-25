/*
  Warnings:

  - You are about to drop the column `expires_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provider` on the `accounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "nextboard"."TAccountType" AS ENUM ('local', 'oauth');

-- CreateEnum
CREATE TYPE "nextboard"."TAccountProvider" AS ENUM ('localPwd', 'localOtp', 'github', 'google', 'wechat', 'qq');

-- DropForeignKey
ALTER TABLE "nextboard"."logs" DROP CONSTRAINT "logs_session_id_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "nextboard"."accounts" DROP COLUMN "expires_at",
ADD COLUMN     "expired_at" TIMESTAMP(3),
DROP COLUMN "type",
ADD COLUMN     "type" "nextboard"."TAccountType" NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "nextboard"."TAccountProvider" NOT NULL;

-- AlterTable
ALTER TABLE "nextboard"."logs" DROP COLUMN "session_id";

-- DropTable
DROP TABLE "nextboard"."sessions";

-- DropTable
DROP TABLE "nextboard"."tokens";

-- CreateTable
CREATE TABLE "nextboard"."vcodes" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vcodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vcodes_owner_code_key" ON "nextboard"."vcodes"("owner", "code");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "nextboard"."accounts"("provider", "provider_account_id");
