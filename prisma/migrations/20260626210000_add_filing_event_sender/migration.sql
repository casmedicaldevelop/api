-- IPS remitente (global de la radicación): código y nombre.
ALTER TABLE "filing_event" ADD COLUMN "sender_code" TEXT NOT NULL DEFAULT '';
ALTER TABLE "filing_event" ADD COLUMN "sender_name" TEXT NOT NULL DEFAULT '';
