-- AlterTable
ALTER TABLE "delivery_event" ADD COLUMN     "invoice_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "service_contract" RENAME CONSTRAINT "servicios_contrato_pkey" TO "service_contract_pkey";
