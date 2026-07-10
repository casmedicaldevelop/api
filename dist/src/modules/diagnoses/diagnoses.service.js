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
exports.DiagnosesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DiagnosesService = class DiagnosesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(search, limit = 20) {
        const take = Math.min(Math.max(limit, 1), 50);
        const where = search?.trim()
            ? {
                OR: [
                    { code: { contains: search.trim(), mode: 'insensitive' } },
                    { description: { contains: search.trim(), mode: 'insensitive' } },
                ],
            }
            : {};
        return this.prisma.diagnosis.findMany({ where, take, orderBy: { code: 'asc' } });
    }
};
exports.DiagnosesService = DiagnosesService;
exports.DiagnosesService = DiagnosesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiagnosesService);
//# sourceMappingURL=diagnoses.service.js.map