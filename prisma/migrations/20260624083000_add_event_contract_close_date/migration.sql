-- Fecha real de cierre del contrato (puede diferir de end_date; null mientras no cierre).
ALTER TABLE "event_contract" ADD COLUMN "close_date" TIMESTAMP(3);
