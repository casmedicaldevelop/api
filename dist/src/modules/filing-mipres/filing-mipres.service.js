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
exports.FilingMipresService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const drive_service_1 = require("../drive/drive.service");
const exceljs_1 = require("exceljs");
const DAY_MS = 24 * 60 * 60 * 1000;
function colombiaDayStart(isoDate) {
    return new Date(`${isoDate}T00:00:00-05:00`);
}
function regimeCode(r) {
    if (r === 'CONTRIBUTIVO')
        return '1';
    if (r === 'SUBSIDIADO')
        return '4';
    return '';
}
function isoDate(d) {
    return d ? d.toISOString().slice(0, 10) : '';
}
const SHELF_CODE_SLOTS = 26 * 100;
function shelfCodeFromValue(value) {
    const slot = (value - 1) % SHELF_CODE_SLOTS;
    const letter = String.fromCharCode(65 + Math.floor(slot / 100));
    const number = (slot % 100) + 1;
    return `${letter}${number}`;
}
const EXPORT_COLUMNS = [
    { header: 'Creado', key: 'createdAt' },
    { header: 'Actualizado', key: 'updatedAt' },
    { header: 'Documento Doctor', key: 'doctorDocument' },
    { header: 'Doctor Nombre', key: 'doctorName' },
    { header: 'Documento Usuario', key: 'userDocument' },
    { header: 'Tipo Doc Usuario', key: 'userDocumentType' },
    { header: 'Género', key: 'userGender' },
    { header: 'Primer Nombre', key: 'userFirstName' },
    { header: 'Segundo Nombre', key: 'userSecondName' },
    { header: 'Primer Apellido', key: 'userFirstSurname' },
    { header: 'Segundo Apellido', key: 'userSecondSurname' },
    { header: 'Teléfono', key: 'userPhone' },
    { header: 'Email', key: 'userEmail' },
    { header: 'F. Nacimiento', key: 'userBirthDate' },
    { header: 'Nacimiento Aprox.', key: 'userBirthDateApproximate' },
    { header: 'Régimen', key: 'userRegime' },
    { header: 'Ciudad', key: 'userCity' },
    { header: 'Barrio', key: 'userNeighborhood' },
    { header: 'Dirección', key: 'userAddress' },
    { header: 'Descripción Usuario', key: 'userDescription' },
    { header: 'Usuario Activo', key: 'userIsActive' },
    { header: 'Prescripción', key: 'prescriptionNumber' },
    { header: 'ID Programación', key: 'scheduleId' },
    { header: 'ID Direccionamiento', key: 'routingId' },
    { header: 'ID Entrega', key: 'deliveryId' },
    { header: 'ID Reporte', key: 'deliveryReportId' },
    { header: 'ID Facturación', key: 'billingId' },
    { header: 'N° Factura', key: 'invoiceCode' },
    { header: 'F. Factura', key: 'invoiceDate' },
    { header: 'Cod. Tecnología', key: 'technologyCode' },
    { header: 'Cod. Inventario', key: 'inventoryCode' },
    { header: 'Medicamento', key: 'medicationName' },
    { header: 'Cant. a entregar', key: 'quantityToDeliver' },
    { header: 'Valor unitario', key: 'unitPrice' },
    { header: 'Valor total', key: 'totalPrice' },
    { header: 'F. Entrega', key: 'deliveryDate' },
    { header: 'F. Máx Entrega', key: 'maxDeliveryDate' },
    { header: 'Código Radicado', key: 'filingCode' },
    { header: 'CUFE', key: 'cufe' },
    { header: 'Estado', key: 'status' },
    { header: 'Subestado', key: 'substatus' },
    { header: 'Cant. pendiente', key: 'quantityPending' },
    { header: 'Cant. entregada', key: 'quantityDelivered' },
];
function serialize(row) {
    return {
        ...row,
        scheduleId: row.scheduleId.toString(),
        routingId: row.routingId?.toString() ?? null,
        deliveryId: row.deliveryId?.toString() ?? null,
        deliveryReportId: row.deliveryReportId?.toString() ?? null,
        billingId: row.billingId?.toString() ?? null,
    };
}
let FilingMipresService = class FilingMipresService {
    prisma;
    drive;
    constructor(prisma, drive) {
        this.prisma = prisma;
        this.drive = drive;
    }
    filingWhere(dto) {
        const where = {};
        if (dto.filingCode)
            where.filingCode = { contains: dto.filingCode, mode: 'insensitive' };
        if (dto.userDocument)
            where.userDocument = { contains: dto.userDocument, mode: 'insensitive' };
        if (dto.prescriptionNumber)
            where.prescriptionNumber = { contains: dto.prescriptionNumber, mode: 'insensitive' };
        if (dto.status)
            where.status = dto.status;
        if (dto.substatus)
            where.substatus = dto.substatus;
        if (dto.dateExact) {
            const start = colombiaDayStart(dto.dateExact);
            where.createdAt = { gte: start, lt: new Date(start.getTime() + DAY_MS) };
        }
        else if (dto.dateFrom || dto.dateTo) {
            where.createdAt = {};
            if (dto.dateFrom)
                where.createdAt.gte = colombiaDayStart(dto.dateFrom);
            if (dto.dateTo)
                where.createdAt.lt = new Date(colombiaDayStart(dto.dateTo).getTime() + DAY_MS);
        }
        return where;
    }
    async exportAll(dto) {
        const where = this.filingWhere(dto);
        const rows = await this.prisma.filingMipres.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        const userDocs = [...new Set(rows.map((r) => r.userDocument))];
        const doctorDocs = [...new Set(rows.map((r) => r.doctorDocument))];
        const [users, doctors] = await Promise.all([
            this.prisma.user.findMany({ where: { id: { in: userDocs } } }),
            this.prisma.doctor.findMany({ where: { id: { in: doctorDocs } } }),
        ]);
        const userMap = new Map(users.map((u) => [u.id, u]));
        const doctorMap = new Map(doctors.map((d) => [d.id, d]));
        const wb = new exceljs_1.Workbook();
        const ws = wb.addWorksheet('Registros');
        ws.columns = EXPORT_COLUMNS.map((c) => ({ header: c.header, key: c.key, width: 20 }));
        const NAVY = 'FF0E2E5A';
        const headerRow = ws.getRow(1);
        headerRow.height = 24;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
        });
        ws.views = [{ state: 'frozen', ySplit: 1 }];
        ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: EXPORT_COLUMNS.length } };
        for (const r of rows) {
            const u = userMap.get(r.userDocument);
            const d = doctorMap.get(r.doctorDocument);
            ws.addRow({
                doctorDocument: r.doctorDocument,
                doctorName: d?.name ?? '',
                userDocument: r.userDocument,
                userDocumentType: u?.documentType ?? '',
                userGender: u?.gender ?? '',
                userFirstName: u?.firstName ?? '',
                userSecondName: u?.secondName ?? '',
                userFirstSurname: u?.firstSurname ?? '',
                userSecondSurname: u?.secondSurname ?? '',
                userPhone: u?.phone ?? '',
                userEmail: u?.email ?? '',
                userBirthDate: isoDate(u?.birthDate ?? null),
                userBirthDateApproximate: u ? (u.birthDateApproximate ? 'Sí' : 'No') : '',
                userRegime: regimeCode(u?.healthcareRegime),
                userCity: u?.city ?? '',
                userNeighborhood: u?.neighborhood ?? '',
                userAddress: u?.address ?? '',
                userDescription: u?.description ?? '',
                userIsActive: u ? (u.isActive ? 'Sí' : 'No') : '',
                prescriptionNumber: r.prescriptionNumber,
                scheduleId: r.scheduleId.toString(),
                routingId: r.routingId?.toString() ?? '',
                deliveryId: r.deliveryId?.toString() ?? '',
                deliveryReportId: r.deliveryReportId?.toString() ?? '',
                billingId: r.billingId?.toString() ?? '',
                invoiceCode: r.invoiceCode ?? '',
                invoiceDate: isoDate(r.invoiceDate),
                technologyCode: r.technologyCode,
                inventoryCode: r.inventoryCode ?? '',
                medicationName: r.medicationName,
                quantityToDeliver: r.quantityToDeliver,
                unitPrice: r.unitPrice,
                totalPrice: r.totalPrice,
                deliveryDate: isoDate(r.deliveryDate),
                maxDeliveryDate: isoDate(r.maxDeliveryDate),
                filingCode: r.filingCode ?? '',
                cufe: r.cufe ?? '',
                status: r.status,
                substatus: r.substatus ?? '',
                quantityPending: r.quantityPending,
                quantityDelivered: r.quantityDelivered,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
            });
        }
        const thin = { style: 'thin', color: { argb: 'FFD9D9D9' } };
        ws.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = { top: thin, left: thin, bottom: thin, right: thin };
                if (rowNumber > 1) {
                    cell.alignment = { vertical: 'middle' };
                    if (rowNumber % 2 === 0) {
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAF1FA' } };
                    }
                }
            });
        });
        return Buffer.from(await wb.xlsx.writeBuffer());
    }
    async scheduleIdsWithDeliveries(prescriptionNumber) {
        if (!prescriptionNumber)
            return [];
        const rows = await this.prisma.deliveryMipres.findMany({
            where: { filing: { prescriptionNumber } },
            distinct: ['scheduleId'],
            select: { scheduleId: true },
        });
        return rows.map((r) => r.scheduleId.toString());
    }
    async setDeliveryByRouting(routingId, deliveryId, deliveryDate) {
        return this.prisma.filingMipres.updateMany({
            where: { routingId },
            data: { deliveryId, deliveryDate },
        });
    }
    async deliveryTotalsByPrescription(prescriptionNumber) {
        if (!prescriptionNumber)
            return [];
        const rows = await this.prisma.filingMipres.findMany({
            where: { prescriptionNumber, deliveryId: { not: null } },
            select: { deliveryId: true, totalPrice: true },
        });
        return rows
            .filter((r) => r.deliveryId !== null)
            .map((r) => ({ deliveryId: r.deliveryId.toString(), totalPrice: r.totalPrice }));
    }
    async setDeliveryReportByDelivery(deliveryId, deliveryReportId) {
        return this.prisma.filingMipres.updateMany({
            where: { deliveryId },
            data: { deliveryReportId },
        });
    }
    async facturacionPrefillByPrescription(prescriptionNumber) {
        if (!prescriptionNumber)
            return [];
        const rows = await this.prisma.filingMipres.findMany({
            where: { prescriptionNumber, deliveryReportId: { not: null } },
            select: { deliveryReportId: true, routingId: true, unitPrice: true },
        });
        return rows
            .filter((r) => r.deliveryReportId !== null)
            .map((r) => ({
            deliveryReportId: r.deliveryReportId.toString(),
            routingId: r.routingId?.toString() ?? null,
            unitPrice: r.unitPrice,
        }));
    }
    async setBillingByDeliveryReport(deliveryReportId, billingId, invoiceCode) {
        return this.prisma.filingMipres.updateMany({
            where: { deliveryReportId },
            data: { billingId, invoiceCode },
        });
    }
    async createFromBinding(data) {
        try {
            const row = await this.prisma.filingMipres.create({
                data: {
                    doctorDocument: data.doctorDocument,
                    userDocument: data.userDocument,
                    prescriptionNumber: data.prescriptionNumber,
                    scheduleId: data.scheduleId,
                    routingId: data.routingId,
                    technologyCode: data.technologyCode,
                    inventoryCode: data.inventoryCode,
                    medicationName: data.medicationName,
                    quantityToDeliver: data.quantityToDeliver,
                    unitPrice: data.unitPrice,
                    totalPrice: data.unitPrice * data.quantityToDeliver,
                    maxDeliveryDate: data.maxDeliveryDate,
                    status: 'PENDIENTE',
                    quantityPending: data.quantityToDeliver,
                    quantityDelivered: 0,
                },
            });
            return serialize(row);
        }
        catch (err) {
            if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new common_1.ConflictException('Ya existe un radicado para este usuario y programación');
            }
            throw err;
        }
    }
    async deleteBySchedule(scheduleId) {
        return this.prisma.filingMipres.deleteMany({ where: { scheduleId } });
    }
    async updateRadicacion(id, dto) {
        const exists = await this.prisma.filingMipres.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!exists)
            throw new common_1.NotFoundException(`Radicado con id ${id} no encontrado`);
        await this.prisma.filingMipres.update({
            where: { id },
            data: {
                invoiceDate: colombiaDayStart(dto.invoiceDate),
                cufe: dto.cufe,
                filingCode: dto.filingCode,
            },
        });
        return this.findOne(id);
    }
    async assignShelfCode(id) {
        const existing = await this.prisma.filingMipres.findUnique({
            where: { id },
            select: { id: true, shelfCode: true },
        });
        if (!existing)
            throw new common_1.NotFoundException(`Radicado con id ${id} no encontrado`);
        if (existing.shelfCode)
            return { shelfCode: existing.shelfCode };
        const counter = await this.prisma.shelfCodeCounter.upsert({
            where: { id: 1 },
            create: { id: 1, value: 1 },
            update: { value: { increment: 1 } },
        });
        const code = shelfCodeFromValue(counter.value);
        const res = await this.prisma.filingMipres.updateMany({
            where: { id, shelfCode: null },
            data: { shelfCode: code },
        });
        if (res.count === 1)
            return { shelfCode: code };
        const reread = await this.prisma.filingMipres.findUnique({
            where: { id },
            select: { shelfCode: true },
        });
        return { shelfCode: reread?.shelfCode ?? code };
    }
    async findIdBySchedule(scheduleId) {
        if (!/^\d+$/.test(scheduleId)) {
            throw new common_1.NotFoundException(`No existe radicado para el código ${scheduleId}`);
        }
        const row = await this.prisma.filingMipres.findFirst({
            where: { scheduleId: BigInt(scheduleId) },
            select: { id: true },
            orderBy: { createdAt: 'desc' },
        });
        if (!row)
            throw new common_1.NotFoundException(`No existe radicado para el código ${scheduleId}`);
        return { id: row.id };
    }
    async findOne(id) {
        const row = await this.prisma.filingMipres.findUnique({ where: { id } });
        if (!row)
            throw new common_1.NotFoundException(`Radicado con id ${id} no encontrado`);
        const [user, doctor, tvData, statuses, substatuses] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: row.userDocument } }),
            this.prisma.doctor.findUnique({ where: { id: row.doctorDocument } }),
            this.prisma.tvData.findFirst({ where: { code: row.technologyCode } }),
            this.prisma.filingMipresStatus.findMany(),
            this.prisma.filingMipresSubstatus.findMany(),
        ]);
        const statusLabel = new Map(statuses.map((s) => [s.code, s.label]));
        const substatusLabel = new Map(substatuses.map((s) => [s.code, s.label]));
        const label = (m, code) => code ? (m.get(code) ?? code) : null;
        return {
            ...serialize(row),
            statusLabel: label(statusLabel, row.status),
            substatusLabel: label(substatusLabel, row.substatus),
            patient: user
                ? {
                    document: user.id,
                    documentType: user.documentType,
                    firstName: user.firstName,
                    secondName: user.secondName,
                    firstSurname: user.firstSurname,
                    secondSurname: user.secondSurname,
                    gender: user.gender,
                    birthDate: user.birthDate,
                    healthcareRegime: user.healthcareRegime,
                    phone: user.phone,
                    email: user.email,
                    city: user.city,
                    neighborhood: user.neighborhood,
                    address: user.address,
                }
                : null,
            doctor: doctor ? { document: doctor.id, name: doctor.name } : null,
            tvData: tvData
                ? { code: tvData.code, name: tvData.name, inventoryCode: tvData.inventoryCode, price: tvData.price }
                : null,
        };
    }
    async filesRootId(filingId) {
        const row = await this.prisma.filingMipres.findUnique({ where: { id: filingId } });
        if (!row)
            throw new common_1.NotFoundException(`Radicado con id ${filingId} no encontrado`);
        if (row.status !== 'ENTREGADO') {
            throw new common_1.ConflictException('Los archivos solo están disponibles cuando la entrega está completa.');
        }
        return this.drive.ensureRadicadoRoot(filingId);
    }
    async assertInTree(itemId, rootId) {
        if (!(await this.drive.isWithinTree(itemId, rootId))) {
            throw new common_1.ForbiddenException('El elemento no pertenece a este radicado.');
        }
    }
    async enrichFolders(items) {
        return Promise.all(items.map(async (it) => {
            if (!it.isFolder)
                return it;
            const children = await this.drive.listChildren(it.id);
            const folderSizeBytes = children
                .filter((c) => !c.isFolder)
                .reduce((acc, c) => acc + (Number(c.size) || 0), 0);
            return { ...it, childCount: children.length, folderSizeBytes };
        }));
    }
    async filesRoot(filingId) {
        const rootId = await this.filesRootId(filingId);
        const [rawItems, path] = await Promise.all([
            this.drive.listChildren(rootId),
            this.drive.pathTo(rootId, rootId),
        ]);
        const items = await this.enrichFolders(rawItems);
        return { rootId, folderId: rootId, path, items };
    }
    async filesTree(filingId) {
        const rootId = await this.filesRootId(filingId);
        const tree = await this.drive.listFolderTree(rootId);
        return { rootId, tree };
    }
    async filesList(filingId, folderId) {
        const rootId = await this.filesRootId(filingId);
        await this.assertInTree(folderId, rootId);
        const [rawItems, path] = await Promise.all([
            this.drive.listChildren(folderId),
            this.drive.pathTo(folderId, rootId),
        ]);
        const items = await this.enrichFolders(rawItems);
        return { rootId, folderId, path, items };
    }
    async filesCreateFolder(filingId, folderId, name) {
        const clean = (name ?? '').trim();
        if (!clean)
            throw new common_1.BadRequestException('El nombre de la carpeta es obligatorio.');
        const rootId = await this.filesRootId(filingId);
        await this.assertInTree(folderId, rootId);
        return this.drive.createFolder(folderId, clean);
    }
    async filesUpload(filingId, folderId, file) {
        if (!file)
            throw new common_1.BadRequestException('No se recibió ningún archivo.');
        const rootId = await this.filesRootId(filingId);
        await this.assertInTree(folderId, rootId);
        return this.drive.uploadToFolder(folderId, file.buffer, file.originalname, file.mimetype);
    }
    async filesDelete(filingId, itemId) {
        const rootId = await this.filesRootId(filingId);
        if (itemId === rootId) {
            throw new common_1.BadRequestException('No se puede eliminar la carpeta raíz del radicado.');
        }
        await this.assertInTree(itemId, rootId);
        await this.drive.deleteItem(itemId);
        return { ok: true };
    }
    async filesContent(filingId, itemId) {
        const rootId = await this.filesRootId(filingId);
        await this.assertInTree(itemId, rootId);
        return this.drive.getStream(itemId);
    }
    async findAll(dto) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        const where = this.filingWhere(dto);
        const [rows, total, byStatus, totalAgg, filingAgg] = await this.prisma.$transaction([
            this.prisma.filingMipres.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.filingMipres.count({ where }),
            this.prisma.filingMipres.groupBy({
                by: ['status'],
                where,
                orderBy: { status: 'asc' },
                _count: true,
            }),
            this.prisma.filingMipres.aggregate({ where, _sum: { totalPrice: true } }),
            this.prisma.filingMipres.aggregate({
                where: { ...where, filingCode: { not: null } },
                _sum: { totalPrice: true },
                _count: true,
            }),
        ]);
        const statusCount = (status) => byStatus.find((g) => g.status === status)?._count ?? 0;
        const totalAmount = totalAgg._sum.totalPrice ?? 0;
        const filingAmount = filingAgg._sum.totalPrice ?? 0;
        const filingCount = filingAgg._count ?? 0;
        return {
            data: rows.map(serialize),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            summary: {
                total,
                pendiente: statusCount('PENDIENTE'),
                entregado: statusCount('ENTREGADO'),
                parcial: statusCount('ENTREGA_PARCIAL'),
                totalAmount,
                filingAmount,
                faltaAmount: totalAmount - filingAmount,
                filingCount,
                faltaCount: total - filingCount,
            },
        };
    }
    async registerDelivery(filingId, dto, employeeId) {
        const filing = await this.prisma.filingMipres.findUnique({ where: { id: filingId } });
        if (!filing)
            throw new common_1.NotFoundException(`Radicado con id ${filingId} no encontrado`);
        if (filing.quantityPending <= 0)
            throw new common_1.BadRequestException('Este medicamento ya fue entregado por completo');
        if (dto.deliveryType === 'SIN_EXISTENCIAS' && filing.quantityDelivered > 0)
            throw new common_1.BadRequestException('No se puede marcar "Sin existencias": ya existe una entrega registrada para este medicamento');
        const pending = filing.quantityPending;
        let delivered;
        if (dto.deliveryType === 'COMPLETA') {
            delivered = pending;
        }
        else if (dto.deliveryType === 'PARCIAL') {
            delivered = dto.quantity ?? 0;
            if (delivered < 1 || delivered >= pending)
                throw new common_1.BadRequestException(`La cantidad parcial debe estar entre 1 y ${pending - 1}`);
        }
        else {
            delivered = 0;
        }
        const pendingAfter = pending - delivered;
        const newStatus = dto.deliveryType === 'COMPLETA'
            ? 'ENTREGADO'
            : dto.deliveryType === 'PARCIAL'
                ? 'ENTREGA_PARCIAL'
                : 'PENDIENTE';
        const newSubstatus = dto.deliveryType === 'COMPLETA' ? 'ENTREGADO' : 'POR_PEDIR';
        return this.prisma.$transaction(async (tx) => {
            await tx.filingMipres.update({
                where: { id: filingId },
                data: {
                    quantityDelivered: filing.quantityDelivered + delivered,
                    quantityPending: pendingAfter,
                    status: newStatus,
                    substatus: newSubstatus,
                },
            });
            if (dto.deliveryType !== 'SIN_EXISTENCIAS') {
                const count = await tx.deliveryMipres.count({ where: { filingId } });
                await tx.deliveryMipres.create({
                    data: {
                        filingId,
                        deliveryNumber: count + 1,
                        deliveryType: dto.deliveryType,
                        quantityDelivered: delivered,
                        quantityPendingAfter: pendingAfter,
                        scheduleId: filing.scheduleId,
                        routingId: filing.routingId ?? BigInt(0),
                        employeeId,
                        comment: dto.comment ?? null,
                    },
                });
            }
            if (pendingAfter > 0) {
                await tx.orderMipres.create({
                    data: {
                        filingId,
                        technologyCode: filing.technologyCode,
                        inventoryCode: filing.inventoryCode,
                        medicationName: filing.medicationName,
                        quantity: pendingAfter,
                        employeeId,
                        scheduleId: filing.scheduleId,
                        routingId: filing.routingId ?? BigInt(0),
                        prescriptionNumber: filing.prescriptionNumber,
                        status: 'POR_PEDIR',
                        isActive: true,
                    },
                });
            }
            return { ok: true, status: newStatus, substatus: newSubstatus, delivered, pendingAfter };
        });
    }
    async listDeliveries(filingId) {
        const deliveries = await this.prisma.deliveryMipres.findMany({
            where: { filingId },
            orderBy: { deliveryNumber: 'asc' },
        });
        const employeeIds = [...new Set(deliveries.map((d) => d.employeeId))];
        const employees = employeeIds.length
            ? await this.prisma.employee.findMany({ where: { id: { in: employeeIds } } })
            : [];
        const employeeName = new Map(employees.map((e) => [e.id, e.name]));
        return deliveries.map((d) => ({
            id: d.id,
            deliveryNumber: d.deliveryNumber,
            deliveryType: d.deliveryType,
            quantityDelivered: d.quantityDelivered,
            quantityPendingAfter: d.quantityPendingAfter,
            comment: d.comment,
            employeeId: d.employeeId,
            employeeName: employeeName.get(d.employeeId) ?? d.employeeId,
            createdAt: d.createdAt,
        }));
    }
};
exports.FilingMipresService = FilingMipresService;
exports.FilingMipresService = FilingMipresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        drive_service_1.DriveService])
], FilingMipresService);
//# sourceMappingURL=filing-mipres.service.js.map