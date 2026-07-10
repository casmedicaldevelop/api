-- Valor total global de la radicación (sumatoria de los valores totales de sus líneas).
ALTER TABLE "filing_event" ADD COLUMN "total_value" INTEGER NOT NULL DEFAULT 0;
