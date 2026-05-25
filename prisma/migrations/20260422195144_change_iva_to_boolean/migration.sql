-- Convert iva from Float (nullable) to Boolean (non-nullable, default false)
-- Conversion rule: value > 0 → true (has IVA), 0 or NULL → false (no IVA)

-- products
ALTER TABLE "products"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "products" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "iva" SET DEFAULT false;

-- provider_1
ALTER TABLE "provider_1"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "provider_1" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "provider_1" ALTER COLUMN "iva" SET DEFAULT false;

-- provider_2
ALTER TABLE "provider_2"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "provider_2" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "provider_2" ALTER COLUMN "iva" SET DEFAULT false;

-- provider_3
ALTER TABLE "provider_3"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "provider_3" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "provider_3" ALTER COLUMN "iva" SET DEFAULT false;

-- provider_4
ALTER TABLE "provider_4"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "provider_4" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "provider_4" ALTER COLUMN "iva" SET DEFAULT false;

-- provider_5
ALTER TABLE "provider_5"
  ALTER COLUMN "iva" TYPE BOOLEAN
    USING (CASE WHEN "iva" IS NOT NULL AND "iva" > 0 THEN TRUE ELSE FALSE END);
ALTER TABLE "provider_5" ALTER COLUMN "iva" SET NOT NULL;
ALTER TABLE "provider_5" ALTER COLUMN "iva" SET DEFAULT false;
