-- Renombra la tabla a inglés y agrega el id del contrato al que pertenece la copia.
ALTER TABLE "servicios_contrato" RENAME TO "service_contract";
ALTER TABLE "service_contract" ADD COLUMN "contract_id" INTEGER NOT NULL;
