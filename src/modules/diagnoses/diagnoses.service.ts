import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class DiagnosesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Busca diagnósticos CIE-10 por código o descripción (para autocompletar). */
  async search(search?: string, limit = 20) {
    const take = Math.min(Math.max(limit, 1), 50)
    const where: Prisma.DiagnosisWhereInput = search?.trim()
      ? {
          OR: [
            { code: { contains: search.trim(), mode: 'insensitive' } },
            { description: { contains: search.trim(), mode: 'insensitive' } },
          ],
        }
      : {}
    return this.prisma.diagnosis.findMany({ where, take, orderBy: { code: 'asc' } })
  }
}
