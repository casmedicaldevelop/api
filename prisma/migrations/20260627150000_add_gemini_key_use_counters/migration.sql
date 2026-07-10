-- Contadores de uso de cada key de Gemini: usos del día (se reinicia cada noche) y pico máximo diario.
ALTER TABLE "gemini_key" ADD COLUMN "daily_use_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "gemini_key" ADD COLUMN "max_use_count" INTEGER NOT NULL DEFAULT 0;
