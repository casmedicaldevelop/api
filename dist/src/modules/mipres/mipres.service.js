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
exports.MipresService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const company_service_1 = require("../company/company.service");
const users_service_1 = require("../users/users.service");
const upstream_failure_exception_1 = require("../../common/filters/upstream-failure.exception");
const SISPRO_TIMEOUT_MS = 15_000;
function isNetworkError(err) {
    if (!err || typeof err !== 'object')
        return false;
    const causeCode = err.cause?.code;
    if (typeof causeCode === 'string') {
        return [
            'UND_ERR_CONNECT_TIMEOUT',
            'UND_ERR_HEADERS_TIMEOUT',
            'UND_ERR_BODY_TIMEOUT',
            'UND_ERR_SOCKET',
            'ECONNREFUSED',
            'ENOTFOUND',
            'EAI_AGAIN',
            'ETIMEDOUT',
        ].includes(causeCode);
    }
    return err instanceof TypeError && /fetch failed/i.test(err.message);
}
let MipresService = class MipresService {
    configService;
    companyService;
    usersService;
    baseUrl;
    facBaseUrl;
    constructor(configService, companyService, usersService) {
        this.configService = configService;
        this.companyService = companyService;
        this.usersService = usersService;
        this.baseUrl = this.configService.get('MIPRES_API_URL', 'https://wsmipres.sispro.gov.co/WSSUMMIPRESNOPBS');
        this.facBaseUrl = this.configService.get('MIPRES_FAC_API_URL', 'https://wsmipres.sispro.gov.co/WSFACMIPRESNOPBS');
    }
    enc(v) {
        return encodeURIComponent(String(v));
    }
    async getCreds() {
        const company = await this.companyService.getCompany();
        if (!company.nit)
            throw new common_1.BadRequestException('NIT de empresa no configurado');
        if (!company.tokenAuth)
            throw new common_1.BadRequestException('Token MIPRES no disponible — el cron aún no ha generado el token o no está configurado');
        return { nit: company.nit, tokenAuth: company.tokenAuth };
    }
    async fetchSispro(method, path, body, baseUrl) {
        const url = `${baseUrl ?? this.baseUrl}${path}`;
        const route = `${method} ${path}`;
        try {
            return await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                signal: AbortSignal.timeout(SISPRO_TIMEOUT_MS),
                ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
            });
        }
        catch (err) {
            if (err instanceof Error && err.name === 'TimeoutError') {
                throw new upstream_failure_exception_1.UpstreamFailureException('SISPRO', `no respondió en ${SISPRO_TIMEOUT_MS / 1000}s`, route, 'TIMEOUT');
            }
            if (isNetworkError(err)) {
                const code = err.cause?.code ?? 'NETWORK_ERROR';
                throw new upstream_failure_exception_1.UpstreamFailureException('SISPRO', 'servidor inalcanzable', route, code);
            }
            throw err;
        }
    }
    async get(path) {
        const res = await this.fetchSispro('GET', path);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new common_1.BadRequestException(text || `MIPRES respondió ${res.status}`);
        }
        return res.json();
    }
    async put(path, body) {
        const res = await this.fetchSispro('PUT', path, body);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new common_1.BadRequestException(text || `MIPRES respondió ${res.status}`);
        }
        return res.json();
    }
    async putFac(path, body) {
        const res = await this.fetchSispro('PUT', path, body, this.facBaseUrl);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new common_1.BadRequestException(text || `MIPRES (FAC) respondió ${res.status}`);
        }
        return res.json();
    }
    async getFac(path) {
        const res = await this.fetchSispro('GET', path, undefined, this.facBaseUrl);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new common_1.BadRequestException(text || `MIPRES (FAC) respondió ${res.status}`);
        }
        return res.json();
    }
    async getRoutingsByPrescription(prescriptionNumber) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.get(`/api/DireccionamientoXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`);
    }
    async getPrescriptionWorkspace(prescriptionNumber) {
        const raw = await this.getRoutingsByPrescription(prescriptionNumber);
        const routings = Array.isArray(raw) ? raw : raw ? [raw] : [];
        if (routings.length === 0) {
            return { prescriptionNumber, routings: [], patient: null };
        }
        const first = routings[0];
        const noDoc = String(first.NoIDPaciente ?? '').trim();
        const tipoDoc = String(first.TipoIDPaciente ?? '').trim();
        const address = String(first.DirPaciente ?? '').trim();
        const user = noDoc ? await this.usersService.findOneOrNull(noDoc) : null;
        if (user) {
            return {
                prescriptionNumber,
                routings,
                patient: { exists: true, user },
            };
        }
        return {
            prescriptionNumber,
            routings,
            patient: { exists: false, fromMipres: { tipoDoc, noDoc, address } },
        };
    }
    async createSchedule(body) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/Programacion/${this.enc(nit)}/${this.enc(tokenAuth)}`, {
            ID: Number(body.miPresDireccionId),
            FecMaxEnt: body.fecMaxEnt,
            TipoIDSedeProv: body.tipoIdSedeProv,
            NoIDSedeProv: body.noIdSedeProv,
            CodSedeProv: body.codSedeProv,
            CodSerTecAEntregar: body.codSerTecAEntregar,
            CantTotAEntregar: body.cantTotAEntregar,
        });
    }
    async getSchedulesByPrescription(prescriptionNumber) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.get(`/api/ProgramacionXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`);
    }
    async cancelSchedule(scheduleId) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/AnularProgramacion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(scheduleId)}`);
    }
    async getDeliveriesByPrescription(prescriptionNumber) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.get(`/api/EntregaXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`);
    }
    async cancelDelivery(deliveryId) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/AnularEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(deliveryId)}`);
    }
    async createDelivery(body) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/Entrega/${this.enc(nit)}/${this.enc(tokenAuth)}`, {
            ID: Number(body.miPresDireccionId),
            CodSerTecEntregado: body.codSerTecEntregado,
            CantTotEntregada: body.cantTotEntregada,
            EntTotal: body.entTotal,
            CausaNoEntrega: body.causaNoEntrega,
            FecEntrega: body.fecEntrega,
            NoLote: body.noLote,
            TipoIDRecibe: body.tipoIdRecibe,
            NoIDRecibe: body.noIdRecibe,
        });
    }
    async createDeliveryReport(body) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/ReporteEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}`, {
            ID: Number(body.miPresEntregaId),
            EstadoEntrega: 1,
            CausaNoEntrega: 0,
            ValorEntregado: body.valorEntregado,
        });
    }
    async getDeliveryReportsByPrescription(prescriptionNumber) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.get(`/api/ReporteEntregaXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`);
    }
    async cancelDeliveryReport(reportId) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.put(`/api/AnularReporteEntrega/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(reportId)}`);
    }
    async createFacturacion(body) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.putFac(`/api/Facturacion/${this.enc(nit)}/${this.enc(tokenAuth)}`, body);
    }
    async getFacturacionesByPrescription(prescriptionNumber) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.getFac(`/api/FacturacionXPrescripcion/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(prescriptionNumber)}`);
    }
    async cancelFacturacion(idFacturacion) {
        const { nit, tokenAuth } = await this.getCreds();
        return this.putFac(`/api/FacturacionAnular/${this.enc(nit)}/${this.enc(tokenAuth)}/${this.enc(idFacturacion)}`);
    }
};
exports.MipresService = MipresService;
exports.MipresService = MipresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        company_service_1.CompanyService,
        users_service_1.UsersService])
], MipresService);
//# sourceMappingURL=mipres.service.js.map