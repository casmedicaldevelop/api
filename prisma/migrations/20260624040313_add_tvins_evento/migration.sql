-- CreateTable
CREATE TABLE "tvins_evento" (
    "id" SERIAL NOT NULL,
    "cum" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "concentration" TEXT NOT NULL,
    "presentation" TEXT NOT NULL,
    "administration_route" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "measurement_unit" INTEGER NOT NULL,
    "pharmaceutical_form" TEXT NOT NULL,
    "dispensing_unit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tvins_evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tvins_evento_cum_idx" ON "tvins_evento"("cum");

-- AddForeignKey
ALTER TABLE "tvins_evento" ADD CONSTRAINT "tvins_evento_measurement_unit_fkey" FOREIGN KEY ("measurement_unit") REFERENCES "measurement_units"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tvins_evento" ADD CONSTRAINT "tvins_evento_dispensing_unit_fkey" FOREIGN KEY ("dispensing_unit") REFERENCES "measurement_units"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tvins_evento" ADD CONSTRAINT "tvins_evento_pharmaceutical_form_fkey" FOREIGN KEY ("pharmaceutical_form") REFERENCES "pharmaceutical_forms"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
