"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventContractService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const EN_CURSO = 'EN CURSO';
const FINALIZADO = 'FINALIZADO';
let EventContractService = class EventContractService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.eventContract.findMany({ orderBy: { id: 'desc' } });
    }
    findActive() {
        return this.prisma.eventContract.findFirst({ where: { status: EN_CURSO } });
    }
    async findOne(id) {
        const contract = await this.prisma.eventContract.findUnique({ where: { id } });
        if (!contract)
            throw new common_1.NotFoundException(`Contrato ${id} no encontrado.`);
        return contract;
    }
    async create(dto) {
        const existing = await this.prisma.eventContract.findFirst({ where: { status: EN_CURSO } });
        if (existing) {
            throw new common_1.BadRequestException('Ya existe un contrato en curso. Finalícelo antes de crear uno nuevo.');
        }
        const contractNumber = dto.contractNumber.trim();
        const duplicate = await this.prisma.eventContract.findUnique({ where: { contractNumber } });
        if (duplicate) {
            throw new common_1.BadRequestException(`Ya existe un contrato con el número ${contractNumber}.`);
        }
        const totalValue = dto.contributoryValue + dto.subsidizedValue;
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
        });
    }
    async setOpen(id, isOpen) {
        const contract = await this.prisma.eventContract.findUnique({ where: { id } });
        if (!contract)
            throw new common_1.NotFoundException(`Contrato ${id} no encontrado.`);
        if (contract.status !== EN_CURSO) {
            throw new common_1.BadRequestException('Solo un contrato en curso puede abrirse o cerrarse.');
        }
        return this.prisma.eventContract.update({ where: { id }, data: { isOpen } });
    }
    async finalize(id, dto) {
        const contract = await this.prisma.eventContract.findUnique({ where: { id } });
        if (!contract)
            throw new common_1.NotFoundException(`Contrato ${id} no encontrado.`);
        if (contract.status !== EN_CURSO) {
            throw new common_1.BadRequestException('Solo se puede finalizar un contrato en curso.');
        }
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.eventContract.update({
                where: { id },
                data: { status: FINALIZADO, closeDate: new Date(dto.closeDate) },
            });
            const [meds, ins] = await Promise.all([
                tx.tvMedEvento.findMany({ where: { isActive: true }, select: { id: true, cum: true, value: true } }),
                tx.tvInsEvento.findMany({ where: { isActive: true }, select: { id: true, cum: true, value: true } }),
            ]);
            const snapshot = [
                ...meds.map((m) => ({ contractId: id, code: m.id, cum: m.cum, service: 'MEDICAMENTO', value: m.value })),
                ...ins.map((i) => ({ contractId: id, code: i.id, cum: i.cum, service: 'INSUMO', value: i.value })),
            ];
            if (snapshot.length)
                await tx.serviceContract.createMany({ data: snapshot });
            await tx.tvMedEvento.updateMany({ data: { isActive: false } });
            await tx.tvInsEvento.updateMany({ data: { isActive: false } });
            return updated;
        });
    }
};
exports.EventContractService = EventContractService;
exports.EventContractService = EventContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventContractService);
//# sourceMappingURL=event-contract.service.js.map