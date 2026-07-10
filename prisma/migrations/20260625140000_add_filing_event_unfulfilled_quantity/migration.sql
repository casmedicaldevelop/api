-- Cantidad no entregada al cerrar una radicación como ENTREGADO (restricción legal: no se entregan recortes).
ALTER TABLE "filing_event" ADD COLUMN "unfulfilled_quantity" INTEGER NOT NULL DEFAULT 0;
