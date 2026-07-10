import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FilingMipresCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listStatuses() {
    return this.prisma.filingMipresStatus.findMany({
      orderBy: { displayOrder: 'asc' },
    })
  }

  listSubstatuses() {
    return this.prisma.filingMipresSubstatus.findMany({
      orderBy: [{ parentStatusCode: 'asc' }, { displayOrder: 'asc' }],
    })
  }
}
