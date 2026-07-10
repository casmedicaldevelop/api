import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateDoctorDto } from './dto/create-doctor.dto'
import { ListDoctorsDto } from './dto/list-doctors.dto'

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListDoctorsDto) {
    const limit = dto.limit ?? 50
    const where: Prisma.DoctorWhereInput = dto.search
      ? {
          OR: [
            { id: { contains: dto.search, mode: 'insensitive' } },
            { name: { contains: dto.search, mode: 'insensitive' } },
          ],
        }
      : {}
    return this.prisma.doctor.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
    })
  }

  async create(dto: CreateDoctorDto) {
    const existing = await this.prisma.doctor.findUnique({ where: { id: dto.id } })
    if (existing) {
      throw new ConflictException(`Ya existe un doctor con documento ${dto.id}`)
    }
    return this.prisma.doctor.create({ data: { id: dto.id, name: dto.name } })
  }
}
