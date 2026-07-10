-- Reduce DocumentType enum to 5 valid values: CC, TI, CE, PA, RC.
-- Business rule: medications are not assigned to people without proper ID.
-- MS, AS, PE, PT are out.
-- Safe to drop + recreate because users.document_type was just added and has
-- zero rows with non-null values.

ALTER TABLE "users" DROP COLUMN "document_type";
DROP TYPE "DocumentType";
CREATE TYPE "DocumentType" AS ENUM ('CC', 'TI', 'CE', 'PA', 'RC');
ALTER TABLE "users" ADD COLUMN "document_type" "DocumentType";
