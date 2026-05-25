-- CreateTable
CREATE TABLE "products" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "box" INTEGER NOT NULL DEFAULT 0,
    "unit" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "products"("is_active");
