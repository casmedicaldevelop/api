-- El estado del contrato se maneja con status (EN CURSO/FINALIZADO); is_active sobra.
ALTER TABLE "event_contract" DROP COLUMN "is_active";
