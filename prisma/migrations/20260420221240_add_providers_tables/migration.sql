-- CreateTable
CREATE TABLE "providers" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "table_key" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_1" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "price_box" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stop_box" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "provider_1_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "provider_2" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "price_box" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stop_box" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "provider_2_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "provider_3" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "price_box" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stop_box" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "provider_3_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "provider_4" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "price_box" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stop_box" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "provider_4_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "provider_5" (
    "code" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "iva" DOUBLE PRECISION,
    "cum" TEXT,
    "price_box" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price_unit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stop_box" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "provider_5_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_name_key" ON "providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "providers_table_key_key" ON "providers"("table_key");
