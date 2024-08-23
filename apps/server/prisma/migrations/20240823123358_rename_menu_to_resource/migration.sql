/*
  Warnings:

  - You are about to drop the column `code` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the column `permissionId` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the `menu_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menus` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role_id,permission_id]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,role_id]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permission_id` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "nextboard"."TResourceOpenTarget" AS ENUM ('external', 'internal', 'internalTab', 'internalTabPinned');

-- DropForeignKey
ALTER TABLE "nextboard"."menu_permissions" DROP CONSTRAINT "menu_permissions_created_by_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."menu_permissions" DROP CONSTRAINT "menu_permissions_menuId_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."menu_permissions" DROP CONSTRAINT "menu_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."menus" DROP CONSTRAINT "menus_created_by_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."menus" DROP CONSTRAINT "menus_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."menus" DROP CONSTRAINT "menus_updated_by_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."user_roles" DROP CONSTRAINT "user_roles_roleId_fkey";

-- DropForeignKey
ALTER TABLE "nextboard"."user_roles" DROP CONSTRAINT "user_roles_userId_fkey";

-- DropIndex
DROP INDEX "nextboard"."role_permissions_roleId_permissionId_key";

-- DropIndex
DROP INDEX "nextboard"."user_roles_userId_roleId_key";

-- AlterTable
ALTER TABLE "nextboard"."permissions" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "nextboard"."role_permissions" DROP COLUMN "permissionId",
DROP COLUMN "roleId",
ADD COLUMN     "permission_id" TEXT NOT NULL,
ADD COLUMN     "role_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nextboard"."user_roles" DROP COLUMN "roleId",
DROP COLUMN "userId",
ADD COLUMN     "role_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "nextboard"."menu_permissions";

-- DropTable
DROP TABLE "nextboard"."menus";

-- DropEnum
DROP TYPE "nextboard"."TMenuOpenTarget";

-- CreateTable
CREATE TABLE "nextboard"."resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "url" TEXT,
    "icon" TEXT,
    "visible" BOOLEAN NOT NULL,
    "keep_alive" BOOLEAN NOT NULL,
    "target" "nextboard"."TResourceOpenTarget" NOT NULL DEFAULT 'internalTab',
    "remark" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nextboard"."resource_permissions" (
    "id" SERIAL NOT NULL,
    "resource_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "nextboard"."resources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resource_permissions_resource_id_permission_id_key" ON "nextboard"."resource_permissions"("resource_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "nextboard"."role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "nextboard"."user_roles"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "nextboard"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "nextboard"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "nextboard"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "nextboard"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "nextboard"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resources" ADD CONSTRAINT "resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nextboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resources" ADD CONSTRAINT "resources_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "nextboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resources" ADD CONSTRAINT "resources_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "nextboard"."resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "nextboard"."resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "nextboard"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nextboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
