-- Marca de activo para los catálogos de evento (medicamentos e insumos). Default false.
ALTER TABLE "tvmed_evento" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "tvins_evento" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT false;
