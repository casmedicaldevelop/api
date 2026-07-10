-- AlterTable
ALTER TABLE "filing_mipres" ADD COLUMN     "shelf_code" TEXT;

-- CreateTable
CREATE TABLE "shelf_code_counter" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shelf_code_counter_pkey" PRIMARY KEY ("id")
);
