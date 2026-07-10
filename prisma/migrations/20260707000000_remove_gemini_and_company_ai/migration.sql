-- Reemplazo del OCR por IA (Gemini) por un parser determinista de la Autorización de servicios.
-- Se elimina toda la configuración de IA: columnas de company y el pool de API keys de Gemini.

-- DropColumns (Company AI config)
ALTER TABLE "company" DROP COLUMN "ai_api_key";
ALTER TABLE "company" DROP COLUMN "ai_model";

-- DropTable (pool global de keys de Gemini)
DROP TABLE "gemini_key";
