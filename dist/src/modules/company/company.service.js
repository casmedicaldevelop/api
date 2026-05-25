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
var CompanyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const SINGLETON_ID = 'singleton';
const MIPRES_BASE_URL = 'https://wsmipres.sispro.gov.co/WSSUMMIPRESNOPBS/api/GenerarToken';
let CompanyService = CompanyService_1 = class CompanyService {
    prisma;
    logger = new common_1.Logger(CompanyService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCompany() {
        const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } });
        if (!company)
            throw new common_1.NotFoundException('La empresa no ha sido configurada');
        return company;
    }
    async upsertCompany(dto) {
        return this.prisma.company.upsert({
            where: { id: SINGLETON_ID },
            update: {
                name: dto.name,
                nit: dto.nit,
                email: dto.email ?? null,
                phone: dto.phone ?? null,
                city: dto.city ?? null,
                address: dto.address ?? null,
            },
            create: {
                id: SINGLETON_ID,
                name: dto.name,
                nit: dto.nit,
                email: dto.email ?? null,
                phone: dto.phone ?? null,
                city: dto.city ?? null,
                address: dto.address ?? null,
            },
        });
    }
    async updateMipres(dto) {
        const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } });
        if (!company)
            throw new common_1.NotFoundException('La empresa no ha sido configurada');
        return this.prisma.company.update({
            where: { id: SINGLETON_ID },
            data: { tokenCompany: dto.tokenCompany ?? null },
        });
    }
    async updateAi(dto) {
        const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } });
        if (!company)
            throw new common_1.NotFoundException('La empresa no ha sido configurada');
        return this.prisma.company.update({
            where: { id: SINGLETON_ID },
            data: {
                aiApiKey: dto.aiApiKey ?? null,
                aiModel: dto.aiModel,
            },
        });
    }
    async generateMipresToken() {
        const company = await this.prisma.company.findUnique({ where: { id: SINGLETON_ID } });
        if (!company?.nit || !company?.tokenCompany) {
            this.logger.warn('generateMipresToken: NIT o Token Empresa no configurados — omitiendo');
            throw new Error('NIT o Token Empresa no configurados en la empresa');
        }
        const url = `${MIPRES_BASE_URL}/${company.nit}/${company.tokenCompany}`;
        this.logger.log(`generateMipresToken: GET ${MIPRES_BASE_URL}/${company.nit}/****`);
        const mipresRes = await fetch(url);
        if (!mipresRes.ok) {
            const body = await mipresRes.text().catch(() => '<unreadable>');
            this.logger.error(`MIPRES ${mipresRes.status} ${mipresRes.statusText} — body: ${body}`);
            let detail = body;
            try {
                const parsed = JSON.parse(body);
                detail = parsed?.Message ?? parsed?.message ?? body;
            }
            catch { }
            throw new Error(`MIPRES respondió ${mipresRes.status}: ${detail}`);
        }
        const raw = await mipresRes.json();
        const tokenAuth = typeof raw === 'string' ? raw : JSON.stringify(raw);
        await this.prisma.company.update({
            where: { id: SINGLETON_ID },
            data: { tokenAuth },
        });
        this.logger.log('generateMipresToken: token de autenticación actualizado correctamente');
        return tokenAuth;
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = CompanyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map