-- CreateTable
CREATE TABLE "nextboard"."dicts" (
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
CREATE UNIQUE INDEX "dicts_name_key" ON "nextboard"."dicts"("name");

-- AddForeignKey
ALTER TABLE "nextboard"."dicts" ADD CONSTRAINT "dicts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "nextboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nextboard"."dicts" ADD CONSTRAINT "dicts_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "nextboard"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
