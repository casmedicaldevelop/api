-- Catálogos de estado/subestado de radicación de evento (copia independiente de los de MIPRES).
CREATE TABLE "filing_event_status" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "filing_event_status_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "filing_event_status_code_key" ON "filing_event_status"("code");

CREATE TABLE "filing_event_substatus" (
    "id" SERIAL NOT NULL,
    "parent_status_code" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "filing_event_substatus_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "filing_event_substatus_parent_status_code_code_key" ON "filing_event_substatus"("parent_status_code", "code");

-- Radicación de evento (tabla principal).
CREATE TABLE "filing_event" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "authorization_code" TEXT NOT NULL,
    "doctor_document" TEXT NOT NULL,
    "user_document" TEXT NOT NULL,
    "regime" TEXT NOT NULL,
    "cum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_value" INTEGER NOT NULL,
    "total_value" INTEGER NOT NULL,
    "concentration" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "administration_route" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "measurement_unit" INTEGER NOT NULL,
    "pharmaceutical_form" TEXT NOT NULL,
    "dispensing_unit" INTEGER NOT NULL,
    "frequency_per_day" INTEGER NOT NULL,
    "treatment_duration" INTEGER NOT NULL,
    "prescribed_quantity" INTEGER NOT NULL,
    "treatment_days" INTEGER NOT NULL,
    "main_diagnosis" TEXT NOT NULL,
    "diagnosis_detail" TEXT NOT NULL,
    "prescription_date" TIMESTAMP(3) NOT NULL,
    "authorization_date" TIMESTAMP(3) NOT NULL,
    "request_date" TIMESTAMP(3) NOT NULL,
    "delivery_date" TIMESTAMP(3),
    "quantity_delivered" INTEGER NOT NULL DEFAULT 0,
    "quantity_pending" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "substatus" TEXT,
    "opportunity" INTEGER,
    "filing_code" TEXT,
    "shelf_code" TEXT,
    "contract_id" INTEGER NOT NULL,
    CONSTRAINT "filing_event_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "filing_event_user_document_idx" ON "filing_event"("user_document");
CREATE INDEX "filing_event_doctor_document_idx" ON "filing_event"("doctor_document");
CREATE INDEX "filing_event_status_idx" ON "filing_event"("status");

-- Entregas (espejo de delivery_mipres, sin campos SISPRO).
CREATE TABLE "delivery_event" (
    "id" SERIAL NOT NULL,
    "filing_event_id" INTEGER NOT NULL,
    "delivery_number" INTEGER NOT NULL,
    "delivery_type" TEXT NOT NULL,
    "quantity_delivered" INTEGER NOT NULL,
    "quantity_pending_after" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "delivery_event_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "delivery_event_filing_event_id_idx" ON "delivery_event"("filing_event_id");

-- Pedidos por faltante (espejo de order_mipres).
CREATE TABLE "order_event" (
    "id" SERIAL NOT NULL,
    "filing_event_id" INTEGER NOT NULL,
    "cum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'POR_PEDIR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "order_event_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "order_event_filing_event_id_idx" ON "order_event"("filing_event_id");
CREATE INDEX "order_event_status_idx" ON "order_event"("status");
CREATE INDEX "order_event_is_active_idx" ON "order_event"("is_active");

ALTER TABLE "delivery_event" ADD CONSTRAINT "delivery_event_filing_event_id_fkey" FOREIGN KEY ("filing_event_id") REFERENCES "filing_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_event" ADD CONSTRAINT "order_event_filing_event_id_fkey" FOREIGN KEY ("filing_event_id") REFERENCES "filing_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed de estados/subestados (copia exacta de los de MIPRES).
INSERT INTO "filing_event_status" ("code","label","display_order","updated_at") VALUES
('ENTREGADO','Entregado',1,CURRENT_TIMESTAMP),
('ENTREGA_PARCIAL','Entrega parcial',2,CURRENT_TIMESTAMP),
('PENDIENTE','Pendiente',3,CURRENT_TIMESTAMP);

INSERT INTO "filing_event_substatus" ("parent_status_code","code","label","display_order","updated_at") VALUES
('ENTREGA_PARCIAL','POR_PEDIR','Por pedir',1,CURRENT_TIMESTAMP),
('ENTREGADO','ENTREGADO','Entregado',1,CURRENT_TIMESTAMP),
('PENDIENTE','POR_PEDIR','Por pedir',1,CURRENT_TIMESTAMP),
('PENDIENTE','PEDIDO_REALIZADO','Pedido realizado',2,CURRENT_TIMESTAMP),
('ENTREGA_PARCIAL','PEDIDO_REALIZADO','Pedido realizado',2,CURRENT_TIMESTAMP),
('ENTREGA_PARCIAL','LISTO','Listo',3,CURRENT_TIMESTAMP),
('PENDIENTE','LISTO','Listo',3,CURRENT_TIMESTAMP);
