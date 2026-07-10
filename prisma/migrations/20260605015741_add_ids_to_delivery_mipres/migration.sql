-- Agrega id de programación (schedule_id) e id de direccionamiento (routing_id) a delivery_mipres.
-- Hay registros existentes: se agregan nullable, se rellenan desde filing_mipres y se marcan NOT NULL.
ALTER TABLE "delivery_mipres" ADD COLUMN "schedule_id" BIGINT;
ALTER TABLE "delivery_mipres" ADD COLUMN "routing_id" BIGINT;

UPDATE "delivery_mipres" d
SET "schedule_id" = f."schedule_id",
    "routing_id" = COALESCE(f."routing_id", 0)
FROM "filing_mipres" f
WHERE d."filing_id" = f."id";

ALTER TABLE "delivery_mipres" ALTER COLUMN "schedule_id" SET NOT NULL;
ALTER TABLE "delivery_mipres" ALTER COLUMN "routing_id" SET NOT NULL;
