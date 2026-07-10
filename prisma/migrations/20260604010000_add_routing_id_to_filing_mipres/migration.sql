-- Add routing_id (IDDireccionamiento del direccionamiento SISPRO amarrado) to filing_mipres.
ALTER TABLE "filing_mipres" ADD COLUMN "routing_id" BIGINT;
