-- Marca de abierto/cerrado del contrato de evento. Default false (cerrado) al crear.
ALTER TABLE "event_contract" ADD COLUMN "is_open" BOOLEAN NOT NULL DEFAULT false;
