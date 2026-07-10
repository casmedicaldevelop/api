import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateEventContractDto } from './dto/create-event-contract.dto'
import { FinalizeEventContractDto } from './dto/finalize-event-contract.dto'

const EN_CURSO = 'EN CURSO'
const FINALIZADO = 'FINALIZADO'

@Injectable()
export class EventContractService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.eventContract.findMany({ orderBy: { id: 'desc' } })
  }

  /** Devuelve el contrato EN CURSO (o null). Lo usa el front para habilitar Radicación de evento. */
  findActive() {
    return this.prisma.eventContract.findFirst({ where: { status: EN_CURSO } })
  }

  async findOne(id: number) {
    const contract = await this.prisma.eventContract.findUnique({ where: { id } })
    if (!contract) throw new NotFoundException(`Contrato ${id} no encontrado.`)
    return contract
  }

  async create(dto: CreateEventContractDto) {
    const existing = await this.prisma.eventContract.findFirst({ where: { status: EN_CURSO } })
    if (existing) {
      throw new BadRequestException('Ya existe un contrato en curso. Finalícelo antes de crear uno nuevo.')
    }
    const contractNumber = dto.contractNumber.trim()
    const duplicate = await this.prisma.eventContract.findUnique({ where: { contractNumber } })
    if (duplicate) {
      throw new BadRequestException(`Ya existe un contrato con el número ${contractNumber}.`)
    }
    const totalValue = dto.contributoryValue + dto.subsidizedValue
    return this.prisma.eventContract.create({
      data: {
        contractNumber,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        contributoryValue: dto.contributoryValue,
        subsidizedValue: dto.subsidizedValue,
        totalValue,
        consumedTotal: 0,
        consumedContributory: 0,
        consumedSubsidized: 0,
        status: EN_CURSO,
      },
    })
  }

  // Abre o cierra un contrato. Solo aplica a contratos EN CURSO.
  async setOpen(id: number, isOpen: boolean) {
    const contract = await this.prisma.eventContract.findUnique({ where: { id } })
    if (!contract) throw new NotFoundException(`Contrato ${id} no encontrado.`)
    if (contract.status !== EN_CURSO) {
      throw new BadRequestException('Solo un contrato en curso puede abrirse o cerrarse.')
    }
    return this.prisma.eventContract.update({ where: { id }, data: { isOpen } })
  }

  async finalize(id: number, dto: FinalizeEventContractDto) {
    const contract = await this.prisma.eventContract.findUnique({ where: { id } })
    if (!contract) throw new NotFoundException(`Contrato ${id} no encontrado.`)
    if (contract.status !== EN_CURSO) {
      throw new BadRequestException('Solo se puede finalizar un contrato en curso.')
    }
    // Al finalizar el contrato: 1) copiar los catálogos activos a service_contract (foto del contrato),
    // 2) recién después desactivar todo en tvmed_evento y tvins_evento.
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.eventContract.update({
        where: { id },
        data: { status: FINALIZADO, closeDate: new Date(dto.closeDate) },
      })

      const [meds, ins] = await Promise.all([
        tx.tvMedEvento.findMany({ where: { isActive: true }, select: { id: true, cum: true, value: true } }),
        tx.tvInsEvento.findMany({ where: { isActive: true }, select: { id: true, cum: true, value: true } }),
      ])
      const snapshot = [
        ...meds.map((m) => ({ contractId: id, code: m.id, cum: m.cum, service: 'MEDICAMENTO', value: m.value })),
        ...ins.map((i) => ({ contractId: id, code: i.id, cum: i.cum, service: 'INSUMO', value: i.value })),
      ]
      if (snapshot.length) await tx.serviceContract.createMany({ data: snapshot })

      await tx.tvMedEvento.updateMany({ data: { isActive: false } })
      await tx.tvInsEvento.updateMany({ data: { isActive: false } })
      return updated
    })
  }
}
