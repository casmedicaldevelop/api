-- El diagnóstico pasa a ser global (cabecera): se mueve de filing_event_item a filing_event.
ALTER TABLE "filing_event" ADD COLUMN "main_diagnosis" TEXT;
ALTER TABLE "filing_event" ADD COLUMN "diagnosis_detail" TEXT;

-- Copia el diagnóstico desde una línea de cada cabecera (hoy hay una línea por cabecera).
UPDATE "filing_event" f SET
  "main_diagnosis" = sub."main_diagnosis",
  "diagnosis_detail" = sub."diagnosis_detail"
FROM (
  SELECT DISTINCT ON ("filing_event_id") "filing_event_id", "main_diagnosis", "diagnosis_detail"
  FROM "filing_event_item" ORDER BY "filing_event_id", "id"
) sub
WHERE sub."filing_event_id" = f."id";

UPDATE "filing_event" SET "main_diagnosis" = COALESCE("main_diagnosis", ''), "diagnosis_detail" = COALESCE("diagnosis_detail", '');
ALTER TABLE "filing_event" ALTER COLUMN "main_diagnosis" SET NOT NULL;
ALTER TABLE "filing_event" ALTER COLUMN "diagnosis_detail" SET NOT NULL;

ALTER TABLE "filing_event_item" DROP COLUMN "main_diagnosis";
ALTER TABLE "filing_event_item" DROP COLUMN "diagnosis_detail";
