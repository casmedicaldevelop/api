-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "iva",
ADD COLUMN     "cum_skipped" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "lot" TEXT NOT NULL,
ADD COLUMN     "warehouse" INTEGER NOT NULL,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "tv_med" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tv_med_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_code_idx" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_cum_cum_skipped_idx" ON "products"("cum", "cum_skipped");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_lot_warehouse_key" ON "products"("code", "lot", "warehouse");

