-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "xboard";

-- CreateEnum
CREATE TYPE "xboard"."TUserGender" AS ENUM ('unknown', 'male', 'female');

-- CreateEnum
CREATE TYPE "xboard"."TResourceOpenTarget" AS ENUM ('external', 'internal', 'internalTab', 'internalTabPinned');

-- CreateEnum
CREATE TYPE "xboard"."TAccountType" AS ENUM ('local', 'oauth');

-- CreateEnum
CREATE TYPE "xboard"."TAccountProvider" AS ENUM ('localPwd', 'localOtp', 'github', 'google', 'wechat', 'qq');

-- CreateTable
CREATE TABLE "xboard"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "display_name" TEXT,
    "email" TEXT NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "avatar" TEXT,
    "gender" "xboard"."TUserGender" NOT NULL DEFAULT 'unknown',
    "birthday" TIMESTAMP(3),
    "online" BOOLEAN NOT NULL DEFAULT false,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "login_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "xboard"."TAccountType" NOT NULL,
    "provider" "xboard"."TAccountProvider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expired_at" TIMESTAMP(3),
    "refresh_expired_at" TIMESTAMP(3),
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."vcodes" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vcodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "remark" TEXT,
    "is_system" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."user_roles" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."role_permissions" (
    "id" SERIAL NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "url" TEXT,
    "icon" TEXT,
    "visible" BOOLEAN NOT NULL,
    "keep_alive" BOOLEAN NOT NULL,
    "target" "xboard"."TResourceOpenTarget" NOT NULL DEFAULT 'internalTab',
    "remark" TEXT,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."resource_permissions" (
    "id" SERIAL NOT NULL,
    "resource_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "user_email" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "operation" TEXT NOT NULL,
    "level" TEXT,
    "meta" JSONB,
    "is_system" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xboard"."dicts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "content" TEXT NOT NULL,
    "meta" JSONB,
    "remark" TEXT,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "dicts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "xboard"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "xboard"."accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "vcodes_owner_code_key" ON "xboard"."vcodes"("owner", "code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "xboard"."roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "xboard"."user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "xboard"."permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_id_permission_id_key" ON "xboard"."role_permissions"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "resources_name_key" ON "xboard"."resources"("name");

-- CreateIndex
CREATE UNIQUE INDEX "resource_permissions_resource_id_permission_id_key" ON "xboard"."resource_permissions"("resource_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "dicts_name_key" ON "xboard"."dicts"("name");

-- AddForeignKey
ALTER TABLE "xboard"."users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."users" ADD CONSTRAINT "users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "xboard"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."roles" ADD CONSTRAINT "roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."roles" ADD CONSTRAINT "roles_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "xboard"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "xboard"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."user_roles" ADD CONSTRAINT "user_roles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."permissions" ADD CONSTRAINT "permissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."permissions" ADD CONSTRAINT "permissions_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "xboard"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "xboard"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."role_permissions" ADD CONSTRAINT "role_permissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resources" ADD CONSTRAINT "resources_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resources" ADD CONSTRAINT "resources_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resources" ADD CONSTRAINT "resources_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "xboard"."resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "xboard"."resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "xboard"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."resource_permissions" ADD CONSTRAINT "resource_permissions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."dicts" ADD CONSTRAINT "dicts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xboard"."dicts" ADD CONSTRAINT "dicts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "xboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
