-- Servicios de un contrato de evento (medicamentos/insumos seleccionados).
CREATE TABLE "servicios_contrato" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "cum" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "servicios_contrato_pkey" PRIMARY KEY ("id")
);
