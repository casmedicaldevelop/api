-- Número de contrato: alfanumérico, obligatorio y único.
-- La tabla ya tiene filas en todos los entornos, así que no se puede añadir NOT NULL de una:
-- 1) columna nullable, 2) relleno determinista y único, 3) NOT NULL, 4) índice único.
-- El marcador SIN-NUMERO-<id> se corrige después con el número real de cada contrato.

ALTER TABLE "event_contract" ADD COLUMN "contract_number" TEXT;

UPDATE "event_contract"
SET "contract_number" = 'SIN-NUMERO-' || "id"
WHERE "contract_number" IS NULL;

ALTER TABLE "event_contract" ALTER COLUMN "contract_number" SET NOT NULL;

CREATE UNIQUE INDEX "event_contract_contract_number_key" ON "event_contract"("contract_number");
