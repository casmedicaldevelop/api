-- CreateTable
CREATE TABLE "service_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "birth_date" TIMESTAMP(3),
    "city" TEXT,
    "neighborhood" TEXT,
    "address" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_users_is_active_idx" ON "service_users"("is_active");

-- CreateIndex
CREATE INDEX "service_users_name_idx" ON "service_users"("name");
