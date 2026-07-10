-- Código de lote/proceso de entrega: agrupa todas las entregas registradas en un mismo proceso.
ALTER TABLE "delivery_event" ADD COLUMN "delivery_batch" TEXT;

CREATE INDEX "delivery_event_delivery_batch_idx" ON "delivery_event"("delivery_batch");
