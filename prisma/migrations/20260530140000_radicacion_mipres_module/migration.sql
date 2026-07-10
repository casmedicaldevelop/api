-- Radicacion MIPRES module — initial DB schema
-- Adds DocumentType enum + users.document_type column, doctors table,
-- status/substatus catalogs (reference tables, NOT FK from radicacion),
-- main radicacion_mipres table, and status history table.

CREATE TYPE "DocumentType" AS ENUM ('CC', 'TI', 'CE', 'PA', 'RC', 'MS', 'AS', 'PE', 'PT');

ALTER TABLE "users" ADD COLUMN "document_type" "DocumentType";

CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "radicacion_mipres_status" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "radicacion_mipres_status_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "radicacion_mipres_status_code_key" ON "radicacion_mipres_status"("code");

CREATE TABLE "radicacion_mipres_substatus" (
    "id" SERIAL NOT NULL,
    "parent_status_code" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "radicacion_mipres_substatus_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "radicacion_mipres_substatus_parent_status_code_code_key"
  ON "radicacion_mipres_substatus"("parent_status_code", "code");

CREATE TABLE "radicacion_mipres" (
    "id" SERIAL NOT NULL,
    "doctor_document" TEXT NOT NULL,
    "user_document" TEXT NOT NULL,
    "prescription_number" TEXT NOT NULL,
    "schedule_id" BIGINT NOT NULL,
    "delivery_id" BIGINT,
    "delivery_report_id" BIGINT,
    "billing_id" BIGINT,
    "invoice_code" TEXT,
    "invoice_date" TIMESTAMP(3),
    "technology_code" TEXT NOT NULL,
    "inventory_code" TEXT,
    "medication_name" TEXT NOT NULL,
    "quantity_to_deliver" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "max_delivery_date" TIMESTAMP(3) NOT NULL,
    "filing_code" TEXT,
    "cufe" TEXT,
    "status" TEXT NOT NULL,
    "substatus" TEXT,
    "quantity_pending" INTEGER NOT NULL,
    "quantity_delivered" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "radicacion_mipres_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "radicacion_mipres_user_document_schedule_id_key"
  ON "radicacion_mipres"("user_document", "schedule_id");
CREATE INDEX "radicacion_mipres_user_document_idx" ON "radicacion_mipres"("user_document");
CREATE INDEX "radicacion_mipres_doctor_document_idx" ON "radicacion_mipres"("doctor_document");
CREATE INDEX "radicacion_mipres_status_idx" ON "radicacion_mipres"("status");

CREATE TABLE "radicacion_mipres_status_history" (
    "id" SERIAL NOT NULL,
    "radicacion_id" INTEGER NOT NULL,
    "previous_status" TEXT,
    "previous_substatus" TEXT,
    "new_status" TEXT NOT NULL,
    "new_substatus" TEXT,
    "comment" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "radicacion_mipres_status_history_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "radicacion_mipres_status_history_radicacion_id_idx"
  ON "radicacion_mipres_status_history"("radicacion_id");
CREATE INDEX "radicacion_mipres_status_history_employee_id_idx"
  ON "radicacion_mipres_status_history"("employee_id");

ALTER TABLE "radicacion_mipres_status_history"
  ADD CONSTRAINT "radicacion_mipres_status_history_radicacion_id_fkey"
  FOREIGN KEY ("radicacion_id") REFERENCES "radicacion_mipres"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
