import { MipresService } from './mipres.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { CreateDeliveryReportDto } from './dto/create-delivery-report.dto';
import { CreateFacturacionDto } from './dto/create-facturacion.dto';
export declare class MipresController {
    private readonly mipresService;
    constructor(mipresService: MipresService);
    getRoutingsByPrescription(prescriptionNumber: string): Promise<unknown>;
    getWorkspace(prescriptionNumber: string): Promise<import("./types/workspace.response").WorkspaceResponse>;
    createSchedule(body: {
        miPresDireccionId: string;
        fecMaxEnt: string;
        tipoIdSedeProv: string;
        noIdSedeProv: string;
        codSedeProv: string;
        codSerTecAEntregar: string;
        cantTotAEntregar: string;
    }): Promise<unknown>;
    getSchedulesByPrescription(prescriptionNumber: string): Promise<unknown>;
    cancelSchedule(id: string): Promise<unknown>;
    getDeliveriesByPrescription(prescriptionNumber: string): Promise<unknown>;
    cancelDelivery(id: string): Promise<unknown>;
    createDelivery(body: CreateDeliveryDto): Promise<unknown>;
    createDeliveryReport(body: CreateDeliveryReportDto): Promise<unknown>;
    getDeliveryReportsByPrescription(prescriptionNumber: string): Promise<unknown>;
    cancelDeliveryReport(id: string): Promise<unknown>;
    createFacturacion(body: CreateFacturacionDto): Promise<unknown>;
    getFacturacionesByPrescription(prescriptionNumber: string): Promise<unknown>;
    cancelFacturacion(id: string): Promise<unknown>;
}
