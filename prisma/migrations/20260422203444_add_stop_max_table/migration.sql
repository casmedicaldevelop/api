-- CreateTable
CREATE TABLE "stop_max" (
    "id" SERIAL NOT NULL,
    "product" TEXT NOT NULL,
    "cum" TEXT,
    "price" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stop_max_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stop_max_product_idx" ON "stop_max"("product");
