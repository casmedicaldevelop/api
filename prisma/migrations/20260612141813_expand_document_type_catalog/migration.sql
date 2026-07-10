-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'CD';
ALTER TYPE "DocumentType" ADD VALUE 'CN';
ALTER TYPE "DocumentType" ADD VALUE 'DE';
ALTER TYPE "DocumentType" ADD VALUE 'MS';
ALTER TYPE "DocumentType" ADD VALUE 'NV';
ALTER TYPE "DocumentType" ADD VALUE 'PE';
ALTER TYPE "DocumentType" ADD VALUE 'PT';
ALTER TYPE "DocumentType" ADD VALUE 'SC';
ALTER TYPE "DocumentType" ADD VALUE 'SI';
