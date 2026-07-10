import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

/**
 * Catálogos de referencia (solo lectura por ahora; el CRUD vivirá en un módulo aparte luego).
 * Alimentan los desplegables de tvmed_evento.
 */
@Injectable()
export class CatalogsService {
  constructor(private readonly prisma: PrismaService) {}

  listMeasurementUnits() {
    return this.prisma.measurementUnit.findMany({ orderBy: { description: 'asc' } })
  }

  listPharmaceuticalForms() {
    return this.prisma.pharmaceuticalForm.findMany({ orderBy: { description: 'asc' } })
  }

  listScientificUnits() {
    return this.prisma.scientificUnit.findMany({ orderBy: { code: 'asc' } })
  }
}
