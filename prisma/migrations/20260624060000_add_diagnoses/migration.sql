-- Catálogo de referencia: diagnósticos (código alfanumérico + descripción).
CREATE TABLE "diagnoses" (
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("code")
);
