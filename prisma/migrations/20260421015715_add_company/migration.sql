-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "name" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "city" TEXT,
    "address" TEXT,
    "code_provider" TEXT,
    "token_company" TEXT,
    "token_auth" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);
