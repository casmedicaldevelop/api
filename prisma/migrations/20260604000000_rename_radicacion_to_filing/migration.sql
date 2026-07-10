-- Rename radicacion_mipres* → filing_mipres* (English identifiers).
-- Pure RENAME: preserves all existing data (no drop/create). Also updates the sidebar module slug.

-- 1. Tables
ALTER TABLE "radicacion_mipres_status" RENAME TO "filing_mipres_status";
ALTER TABLE "radicacion_mipres_substatus" RENAME TO "filing_mipres_substatus";
ALTER TABLE "radicacion_mipres" RENAME TO "filing_mipres";
ALTER TABLE "radicacion_mipres_status_history" RENAME TO "filing_mipres_status_history";

-- 2. Column
ALTER TABLE "filing_mipres_status_history" RENAME COLUMN "radicacion_id" TO "filing_id";

-- 3. Primary keys
ALTER INDEX "radicacion_mipres_status_pkey" RENAME TO "filing_mipres_status_pkey";
ALTER INDEX "radicacion_mipres_substatus_pkey" RENAME TO "filing_mipres_substatus_pkey";
ALTER INDEX "radicacion_mipres_pkey" RENAME TO "filing_mipres_pkey";
ALTER INDEX "radicacion_mipres_status_history_pkey" RENAME TO "filing_mipres_status_history_pkey";

-- 4. Unique indexes
ALTER INDEX "radicacion_mipres_status_code_key" RENAME TO "filing_mipres_status_code_key";
ALTER INDEX "radicacion_mipres_substatus_parent_status_code_code_key" RENAME TO "filing_mipres_substatus_parent_status_code_code_key";
ALTER INDEX "radicacion_mipres_user_document_schedule_id_key" RENAME TO "filing_mipres_user_document_schedule_id_key";

-- 5. Secondary indexes
ALTER INDEX "radicacion_mipres_user_document_idx" RENAME TO "filing_mipres_user_document_idx";
ALTER INDEX "radicacion_mipres_doctor_document_idx" RENAME TO "filing_mipres_doctor_document_idx";
ALTER INDEX "radicacion_mipres_status_idx" RENAME TO "filing_mipres_status_idx";
ALTER INDEX "radicacion_mipres_status_history_radicacion_id_idx" RENAME TO "filing_mipres_status_history_filing_id_idx";
ALTER INDEX "radicacion_mipres_status_history_employee_id_idx" RENAME TO "filing_mipres_status_history_employee_id_idx";

-- 6. Foreign key constraint
ALTER TABLE "filing_mipres_status_history" RENAME CONSTRAINT "radicacion_mipres_status_history_radicacion_id_fkey" TO "filing_mipres_status_history_filing_id_fkey";

-- 7. Sidebar module slug (route is built from modules.name → keep it in sync with the frontend route)
UPDATE "modules" SET "name" = 'filing-mipres' WHERE "name" = 'radicacion-mipres';
