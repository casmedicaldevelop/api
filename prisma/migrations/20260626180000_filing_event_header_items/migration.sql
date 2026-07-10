-- Radicación de evento → cabecera (filing_event) + detalle (filing_event_item).
-- Cada medicamento/insumo pasa a ser una línea; entregas y pedidos se enlazan a la línea.

-- 1. Nueva tabla de líneas
CREATE TABLE "filing_event_item" (
  "id" SERIAL NOT NULL,
  "filing_event_id" INTEGER NOT NULL,
  "cum" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "service_type" TEXT,
  "quantity" INTEGER NOT NULL,
  "unit_value" INTEGER NOT NULL,
  "total_value" INTEGER NOT NULL,
  "concentration" TEXT NOT NULL,
  "presentation" TEXT NOT NULL,
  "administration_route" TEXT NOT NULL,
  "short_name" TEXT NOT NULL,
  "measurement_unit" INTEGER NOT NULL,
  "pharmaceutical_form" TEXT NOT NULL,
  "dispensing_unit" INTEGER NOT NULL,
  "main_diagnosis" TEXT NOT NULL,
  "diagnosis_detail" TEXT NOT NULL,
  "frequency_per_day" INTEGER NOT NULL,
  "treatment_duration" INTEGER NOT NULL,
  "prescribed_quantity" INTEGER NOT NULL,
  "treatment_days" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "substatus" TEXT,
  "delivery_date" TIMESTAMP(3),
  "opportunity" INTEGER,
  "quantity_delivered" INTEGER NOT NULL DEFAULT 0,
  "quantity_pending" INTEGER NOT NULL,
  "unfulfilled_quantity" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "filing_event_item_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "filing_event_item_filing_event_id_idx" ON "filing_event_item"("filing_event_id");
CREATE INDEX "filing_event_item_cum_idx" ON "filing_event_item"("cum");
CREATE INDEX "filing_event_item_status_idx" ON "filing_event_item"("status");
ALTER TABLE "filing_event_item" ADD CONSTRAINT "filing_event_item_filing_event_id_fkey"
  FOREIGN KEY ("filing_event_id") REFERENCES "filing_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Migrar datos existentes: una línea por cada filing_event actual
INSERT INTO "filing_event_item" (
  "filing_event_id","cum","name","service_type","quantity","unit_value","total_value",
  "concentration","presentation","administration_route","short_name","measurement_unit",
  "pharmaceutical_form","dispensing_unit","main_diagnosis","diagnosis_detail","frequency_per_day",
  "treatment_duration","prescribed_quantity","treatment_days","status","substatus","delivery_date",
  "opportunity","quantity_delivered","quantity_pending","unfulfilled_quantity"
)
SELECT
  "id","cum","name","service_type","quantity","unit_value","total_value",
  "concentration","presentation","administration_route","short_name","measurement_unit",
  "pharmaceutical_form","dispensing_unit","main_diagnosis","diagnosis_detail","frequency_per_day",
  "treatment_duration","prescribed_quantity","treatment_days","status","substatus","delivery_date",
  "opportunity","quantity_delivered","quantity_pending","unfulfilled_quantity"
FROM "filing_event";

-- 3. Repuntar delivery_event a la línea
ALTER TABLE "delivery_event" DROP CONSTRAINT IF EXISTS "delivery_event_filing_event_id_fkey";
ALTER TABLE "delivery_event" ADD COLUMN "filing_event_item_id" INTEGER;
UPDATE "delivery_event" d SET "filing_event_item_id" = i."id"
  FROM "filing_event_item" i WHERE i."filing_event_id" = d."filing_event_id";
ALTER TABLE "delivery_event" ALTER COLUMN "filing_event_item_id" SET NOT NULL;
DROP INDEX IF EXISTS "delivery_event_filing_event_id_idx";
ALTER TABLE "delivery_event" DROP COLUMN "filing_event_id";
CREATE INDEX "delivery_event_filing_event_item_id_idx" ON "delivery_event"("filing_event_item_id");
ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_filing_event_item_id_fkey"
  FOREIGN KEY ("filing_event_item_id") REFERENCES "filing_event_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Repuntar order_event a la línea
ALTER TABLE "order_event" DROP CONSTRAINT IF EXISTS "order_event_filing_event_id_fkey";
ALTER TABLE "order_event" ADD COLUMN "filing_event_item_id" INTEGER;
UPDATE "order_event" o SET "filing_event_item_id" = i."id"
  FROM "filing_event_item" i WHERE i."filing_event_id" = o."filing_event_id";
ALTER TABLE "order_event" ALTER COLUMN "filing_event_item_id" SET NOT NULL;
DROP INDEX IF EXISTS "order_event_filing_event_id_idx";
ALTER TABLE "order_event" DROP COLUMN "filing_event_id";
CREATE INDEX "order_event_filing_event_item_id_idx" ON "order_event"("filing_event_item_id");
ALTER TABLE "order_event" ADD CONSTRAINT "order_event_filing_event_item_id_fkey"
  FOREIGN KEY ("filing_event_item_id") REFERENCES "filing_event_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 5. Quitar de filing_event (cabecera) las columnas que se movieron a la línea
ALTER TABLE "filing_event"
  DROP COLUMN "cum",
  DROP COLUMN "name",
  DROP COLUMN "service_type",
  DROP COLUMN "quantity",
  DROP COLUMN "unit_value",
  DROP COLUMN "total_value",
  DROP COLUMN "concentration",
  DROP COLUMN "presentation",
  DROP COLUMN "administration_route",
  DROP COLUMN "short_name",
  DROP COLUMN "measurement_unit",
  DROP COLUMN "pharmaceutical_form",
  DROP COLUMN "dispensing_unit",
  DROP COLUMN "main_diagnosis",
  DROP COLUMN "diagnosis_detail",
  DROP COLUMN "frequency_per_day",
  DROP COLUMN "treatment_duration",
  DROP COLUMN "prescribed_quantity",
  DROP COLUMN "treatment_days",
  DROP COLUMN "substatus",
  DROP COLUMN "opportunity",
  DROP COLUMN "delivery_date",
  DROP COLUMN "quantity_delivered",
  DROP COLUMN "quantity_pending",
  DROP COLUMN "unfulfilled_quantity";
