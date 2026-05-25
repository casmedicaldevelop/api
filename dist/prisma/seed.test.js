"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
beforeAll(async () => {
    await prisma.$connect();
});
afterAll(async () => {
    await prisma.$disconnect();
});
describe('seed', () => {
    it('creates exactly 7 modules', async () => {
        const count = await prisma.module.count();
        expect(count).toBe(7);
    });
    it('modules have PascalCase Lucide icon names', async () => {
        const modules = await prisma.module.findMany({ select: { icon: true } });
        for (const mod of modules) {
            expect(mod.icon).toMatch(/^[A-Z]/);
        }
    });
    it('creates exactly 1 admin user', async () => {
        const count = await prisma.user.count({ where: { username: 'admin' } });
        expect(count).toBe(1);
    });
    it('admin user has role ADMIN and mustChangePassword true', async () => {
        const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
        expect(admin?.role).toBe('ADMIN');
        expect(admin?.mustChangePassword).toBe(true);
    });
    it('admin password is a bcrypt hash (not plaintext)', async () => {
        const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
        expect(admin?.password).toMatch(/^\$2[ab]\$/);
        const valid = await bcrypt.compare('Admin123!', admin.password);
        expect(valid).toBe(true);
    });
    it('seed is idempotent — running twice does not duplicate rows', async () => {
        const modulesBefore = await prisma.module.count();
        const usersBefore = await prisma.user.count();
        const { main } = await import('./seed.js');
        await main();
        const modulesAfter = await prisma.module.count();
        const usersAfter = await prisma.user.count();
        expect(modulesAfter).toBe(modulesBefore);
        expect(usersAfter).toBe(usersBefore);
    });
});
//# sourceMappingURL=seed.test.js.map