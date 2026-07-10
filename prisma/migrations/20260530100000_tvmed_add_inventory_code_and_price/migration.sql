-- Add inventory_code (nullable, free text) and price (NOT NULL integer, default 0)
-- to the tv_med catalog. inventory_code lets a TvMed entry reference the same
-- product in the local inventory when present; some entries have no inventory
-- counterpart so it is nullable. price stores Colombian pesos as a whole number
-- (no decimals); a default of 0 lets the migration apply non-destructively over
-- existing rows.

ALTER TABLE "tv_med"
  ADD COLUMN "inventory_code" TEXT,
  ADD COLUMN "price" INTEGER NOT NULL DEFAULT 0;
