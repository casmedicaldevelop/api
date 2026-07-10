import type { Response } from 'express';
import { FilingMipresService } from './filing-mipres.service';
import { ListFilingMipresDto } from './dto/list-filing-mipres.dto';
import { RegisterDeliveryDto } from './dto/register-delivery.dto';
import { UpdateRadicacionDto } from './dto/update-radicacion.dto';
import { DriveService } from '../drive/drive.service';
export declare class FilingMipresController {
    private readonly service;
    private readonly drive;
    constructor(service: FilingMipresService, drive: DriveService);
    findAll(dto: ListFilingMipresDto): Promise<{
        data: {
            scheduleId: string;
            routingId: string | null;
            deliveryId: string | null;
            deliveryReportId: string | null;
            billingId: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            filingCode: string | null;
            userDocument: string;
            prescriptionNumber: string;
            substatus: string | null;
            doctorDocument: string;
            invoiceCode: string | null;
            invoiceDate: Date | null;
            technologyCode: string;
            inventoryCode: string | null;
            medicationName: string;
            quantityToDeliver: number;
            unitPrice: number;
            totalPrice: number;
            deliveryDate: Date | null;
            maxDeliveryDate: Date;
            cufe: string | null;
            shelfCode: string | null;
            quantityPending: number;
            quantityDelivered: number;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        summary: {
            total: number;
            pendiente: number | true | {
                id?: number | undefined;
                doctorDocument?: number | undefined;
                userDocument?: number | undefined;
                prescriptionNumber?: number | undefined;
                scheduleId?: number | undefined;
                routingId?: number | undefined;
                deliveryId?: number | undefined;
                deliveryReportId?: number | undefined;
                billingId?: number | undefined;
                invoiceCode?: number | undefined;
                invoiceDate?: number | undefined;
                technologyCode?: number | undefined;
                inventoryCode?: number | undefined;
                medicationName?: number | undefined;
                quantityToDeliver?: number | undefined;
                unitPrice?: number | undefined;
                totalPrice?: number | undefined;
                deliveryDate?: number | undefined;
                maxDeliveryDate?: number | undefined;
                filingCode?: number | undefined;
                cufe?: number | undefined;
                shelfCode?: number | undefined;
                status?: number | undefined;
                substatus?: number | undefined;
                quantityPending?: number | undefined;
                quantityDelivered?: number | undefined;
                createdAt?: number | undefined;
                updatedAt?: number | undefined;
                _all?: number | undefined;
            };
            entregado: number | true | {
                id?: number | undefined;
                doctorDocument?: number | undefined;
                userDocument?: number | undefined;
                prescriptionNumber?: number | undefined;
                scheduleId?: number | undefined;
                routingId?: number | undefined;
                deliveryId?: number | undefined;
                deliveryReportId?: number | undefined;
                billingId?: number | undefined;
                invoiceCode?: number | undefined;
                invoiceDate?: number | undefined;
                technologyCode?: number | undefined;
                inventoryCode?: number | undefined;
                medicationName?: number | undefined;
                quantityToDeliver?: number | undefined;
                unitPrice?: number | undefined;
                totalPrice?: number | undefined;
                deliveryDate?: number | undefined;
                maxDeliveryDate?: number | undefined;
                filingCode?: number | undefined;
                cufe?: number | undefined;
                shelfCode?: number | undefined;
                status?: number | undefined;
                substatus?: number | undefined;
                quantityPending?: number | undefined;
                quantityDelivered?: number | undefined;
                createdAt?: number | undefined;
                updatedAt?: number | undefined;
                _all?: number | undefined;
            };
            parcial: number | true | {
                id?: number | undefined;
                doctorDocument?: number | undefined;
                userDocument?: number | undefined;
                prescriptionNumber?: number | undefined;
                scheduleId?: number | undefined;
                routingId?: number | undefined;
                deliveryId?: number | undefined;
                deliveryReportId?: number | undefined;
                billingId?: number | undefined;
                invoiceCode?: number | undefined;
                invoiceDate?: number | undefined;
                technologyCode?: number | undefined;
                inventoryCode?: number | undefined;
                medicationName?: number | undefined;
                quantityToDeliver?: number | undefined;
                unitPrice?: number | undefined;
                totalPrice?: number | undefined;
                deliveryDate?: number | undefined;
                maxDeliveryDate?: number | undefined;
                filingCode?: number | undefined;
                cufe?: number | undefined;
                shelfCode?: number | undefined;
                status?: number | undefined;
                substatus?: number | undefined;
                quantityPending?: number | undefined;
                quantityDelivered?: number | undefined;
                createdAt?: number | undefined;
                updatedAt?: number | undefined;
                _all?: number | undefined;
            };
            totalAmount: number;
            filingAmount: number;
            faltaAmount: number;
            filingCount: number;
            faltaCount: number;
        };
    }>;
    deliveredScheduleIds(prescriptionNumber: string): Promise<string[]>;
    deliveryTotals(prescriptionNumber: string): Promise<{
        deliveryId: string;
        totalPrice: number;
    }[]>;
    facturacionPrefill(prescriptionNumber: string): Promise<{
        deliveryReportId: string;
        routingId: string | null;
        unitPrice: number;
    }[]>;
    export(dto: ListFilingMipresDto, res: Response): Promise<void>;
    exportToDrive(dto: ListFilingMipresDto): Promise<{
        id: string;
        webViewLink: string;
    }>;
    findIdBySchedule(scheduleId: string): Promise<{
        id: number;
    }>;
    driveQuota(): Promise<{
        limitBytes: number | null;
        usageBytes: number;
    }>;
    findOne(id: number): Promise<{
        statusLabel: string | null;
        substatusLabel: string | null;
        patient: {
            document: string;
            documentType: import("@prisma/client").$Enums.DocumentType | null;
            firstName: string;
            secondName: string | null;
            firstSurname: string;
            secondSurname: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            birthDate: Date | null;
            healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
            phone: string;
            email: string | null;
            city: string | null;
            neighborhood: string | null;
            address: string | null;
        } | null;
        doctor: {
            document: string;
            name: string;
        } | null;
        tvData: {
            code: string;
            name: string;
            inventoryCode: string | null;
            price: number;
        } | null;
        scheduleId: string;
        routingId: string | null;
        deliveryId: string | null;
        deliveryReportId: string | null;
        billingId: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        filingCode: string | null;
        userDocument: string;
        prescriptionNumber: string;
        substatus: string | null;
        doctorDocument: string;
        invoiceCode: string | null;
        invoiceDate: Date | null;
        technologyCode: string;
        inventoryCode: string | null;
        medicationName: string;
        quantityToDeliver: number;
        unitPrice: number;
        totalPrice: number;
        deliveryDate: Date | null;
        maxDeliveryDate: Date;
        cufe: string | null;
        shelfCode: string | null;
        quantityPending: number;
        quantityDelivered: number;
    }>;
    updateRadicacion(id: number, dto: UpdateRadicacionDto): Promise<{
        statusLabel: string | null;
        substatusLabel: string | null;
        patient: {
            document: string;
            documentType: import("@prisma/client").$Enums.DocumentType | null;
            firstName: string;
            secondName: string | null;
            firstSurname: string;
            secondSurname: string | null;
            gender: import("@prisma/client").$Enums.Gender | null;
            birthDate: Date | null;
            healthcareRegime: import("@prisma/client").$Enums.HealthcareRegime | null;
            phone: string;
            email: string | null;
            city: string | null;
            neighborhood: string | null;
            address: string | null;
        } | null;
        doctor: {
            document: string;
            name: string;
        } | null;
        tvData: {
            code: string;
            name: string;
            inventoryCode: string | null;
            price: number;
        } | null;
        scheduleId: string;
        routingId: string | null;
        deliveryId: string | null;
        deliveryReportId: string | null;
        billingId: string | null;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        filingCode: string | null;
        userDocument: string;
        prescriptionNumber: string;
        substatus: string | null;
        doctorDocument: string;
        invoiceCode: string | null;
        invoiceDate: Date | null;
        technologyCode: string;
        inventoryCode: string | null;
        medicationName: string;
        quantityToDeliver: number;
        unitPrice: number;
        totalPrice: number;
        deliveryDate: Date | null;
        maxDeliveryDate: Date;
        cufe: string | null;
        shelfCode: string | null;
        quantityPending: number;
        quantityDelivered: number;
    }>;
    assignShelfCode(id: number): Promise<{
        shelfCode: string;
    }>;
    listDeliveries(id: number): Promise<{
        id: number;
        deliveryNumber: number;
        deliveryType: string;
        quantityDelivered: number;
        quantityPendingAfter: number;
        comment: string | null;
        employeeId: string;
        employeeName: string;
        createdAt: Date;
    }[]>;
    registerDelivery(id: number, dto: RegisterDeliveryDto, req: {
        user: {
            sub: string;
        };
    }): Promise<{
        ok: boolean;
        status: string;
        substatus: string;
        delivered: number;
        pendingAfter: number;
    }>;
    filesRoot(id: number): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: import("../drive/drive.service").DriveItem[];
    }>;
    filesTree(id: number): Promise<{
        rootId: string;
        tree: import("../drive/drive.service").FolderNode[];
    }>;
    createFolder(id: number, folderId: string, body: {
        name: string;
    }): Promise<import("../drive/drive.service").DriveItem>;
    uploadFile(id: number, folderId: string, file: {
        originalname: string;
        mimetype: string;
        buffer: Buffer;
    }): Promise<import("../drive/drive.service").DriveItem>;
    fileContent(id: number, itemId: string, disposition: string, res: Response): Promise<void>;
    filesList(id: number, folderId: string): Promise<{
        rootId: string;
        folderId: string;
        path: {
            id: string;
            name: string;
        }[];
        items: import("../drive/drive.service").DriveItem[];
    }>;
    deleteItem(id: number, itemId: string): Promise<{
        ok: true;
    }>;
}
