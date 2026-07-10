-- Pool global de API keys de Gemini para rotación (LRU por last_used_at).
CREATE TABLE "gemini_key" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gemini_key_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "gemini_key_key_key" ON "gemini_key"("key");
