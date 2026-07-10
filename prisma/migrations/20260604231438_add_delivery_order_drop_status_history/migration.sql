/*
  Warnings:

  - You are about to drop the `filing_mipres_status_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "filing_mipres_status_history" DROP CONSTRAINT "filing_mipres_status_history_filing_id_fkey";

-- DropTable
DROP TABLE "filing_mipres_status_history";

-- CreateTable
CREATE TABLE "delivery_mipres" (
    "id" SERIAL NOT NULL,
    "filing_id" INTEGER NOT NULL,
    "delivery_number" INTEGER NOT NULL,
    "delivery_type" TEXT NOT NULL,
    "quantity_delivered" INTEGER NOT NULL,
    "quantity_pending_after" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delivery_mipres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_mipres" (
    "id" SERIAL NOT NULL,
    "filing_id" INTEGER NOT NULL,
    "delivery_id" INTEGER,
    "technology_code" TEXT NOT NULL,
    "inventory_code" TEXT,
    "medication_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "schedule_id" BIGINT NOT NULL,
    "routing_id" BIGINT NOT NULL,
    "prescription_number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'POR_PEDIR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_mipres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "delivery_mipres_filing_id_idx" ON "delivery_mipres"("filing_id");

-- CreateIndex
CREATE INDEX "order_mipres_filing_id_idx" ON "order_mipres"("filing_id");

-- CreateIndex
CREATE INDEX "order_mipres_status_idx" ON "order_mipres"("status");

-- CreateIndex
CREATE INDEX "order_mipres_is_active_idx" ON "order_mipres"("is_active");

-- AddForeignKey
ALTER TABLE "delivery_mipres" ADD CONSTRAINT "delivery_mipres_filing_id_fkey" FOREIGN KEY ("filing_id") REFERENCES "filing_mipres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_mipres" ADD CONSTRAINT "order_mipres_filing_id_fkey" FOREIGN KEY ("filing_id") REFERENCES "filing_mipres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_mipres" ADD CONSTRAINT "order_mipres_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery_mipres"("id") ON DELETE SET NULL ON UPDATE CASCADE;
