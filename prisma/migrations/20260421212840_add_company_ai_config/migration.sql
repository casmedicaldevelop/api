-- AlterTable
ALTER TABLE "company" ADD COLUMN     "ai_api_key" TEXT,
ADD COLUMN     "ai_model" TEXT DEFAULT 'gemini-3-flash-preview';
