/*
  Warnings:

  - You are about to drop the column `delivery_id` on the `order_mipres` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_mipres" DROP CONSTRAINT "order_mipres_delivery_id_fkey";

-- AlterTable
ALTER TABLE "order_mipres" DROP COLUMN "delivery_id";
