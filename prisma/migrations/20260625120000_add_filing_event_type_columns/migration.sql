-- Agrega tipo de usuario (afiliado) y tipo de servicio (medicamento/insumo) a la radicación de evento.
ALTER TABLE "filing_event" ADD COLUMN "user_type" TEXT;
ALTER TABLE "filing_event" ADD COLUMN "service_type" TEXT;
