-- Elimina la columna regime de filing_event (no se usa; el régimen vive en user_type).
ALTER TABLE "filing_event" DROP COLUMN "regime";
