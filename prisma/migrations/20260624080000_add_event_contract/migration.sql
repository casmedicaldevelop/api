-- Contrato de evento: vigencia + valores y consumos por régimen (todo en COP, enteros).
CREATE TABLE "event_contract" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "total_value" INTEGER NOT NULL,
    "contributory_value" INTEGER NOT NULL,
    "subsidized_value" INTEGER NOT NULL,
    "consumed_total" INTEGER NOT NULL DEFAULT 0,
    "consumed_contributory" INTEGER NOT NULL DEFAULT 0,
    "consumed_subsidized" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "event_contract_pkey" PRIMARY KEY ("id")
);
