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
exports.main = main;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const modules = [
    { name: 'dashboard', label: 'Inicio', icon: 'LayoutDashboard', displayOrder: 0 },
    { name: 'usuarios', label: 'Usuarios', icon: 'Users', displayOrder: 1 },
    { name: 'clients', label: 'Clientes', icon: 'Users', displayOrder: 2 },
    { name: 'orders', label: 'Pedidos', icon: 'ShoppingCart', displayOrder: 2 },
    { name: 'products', label: 'Productos', icon: 'Package', displayOrder: 3 },
    { name: 'providers', label: 'Proveedores', icon: 'Truck', displayOrder: 4 },
    { name: 'reports', label: 'Reportes', icon: 'BarChart2', displayOrder: 6 },
    { name: 'settings', label: 'Configuración', icon: 'Settings', displayOrder: 7 },
];
const staticProviders = [
    { id: 1, name: 'DIS', tableKey: 'provider_1', address: null, phone: null, description: null },
    { id: 2, name: 'OFFI', tableKey: 'provider_2', address: null, phone: null, description: null },
    { id: 3, name: 'RAM', tableKey: 'provider_3', address: null, phone: null, description: null },
    { id: 4, name: 'OASIS', tableKey: 'provider_4', address: null, phone: null, description: null },
    { id: 5, name: 'FARMA', tableKey: 'provider_5', address: null, phone: null, description: null },
];
const testUsers = [
    {
        name: 'Administrador',
        username: 'admin',
        password: 'Password.2026+',
        email: 'gerenciageneral@casmedical.com.co',
        identificationNumber: '0000000000',
        role: client_1.Role.ADMIN,
        mustChangePassword: true,
        moduleNames: [],
    },
    {
        name: 'Auxiliar Operativo',
        username: 'auxiliar1',
        password: 'Auxiliar1!',
        email: 'auxiliar1@casmedical.com.co',
        identificationNumber: '1111111111',
        role: client_1.Role.USER,
        mustChangePassword: true,
        moduleNames: ['clients', 'orders', 'products', 'providers'],
    },
    {
        name: 'Auxiliar Ventas',
        username: 'auxiliar2',
        password: 'Auxiliar2!',
        email: 'auxiliar2@casmedical.com.co',
        identificationNumber: '2222222222',
        role: client_1.Role.USER,
        mustChangePassword: true,
        moduleNames: ['clients', 'orders'],
    },
    {
        name: 'Analista Reportes',
        username: 'reportes',
        password: 'Reportes1!',
        email: 'reportes@casmedical.com.co',
        identificationNumber: '3333333333',
        role: client_1.Role.USER,
        mustChangePassword: true,
        moduleNames: ['dashboard', 'reports'],
    },
];
async function main() {
    const adminModuleNames = ['staff', 'user-management', 'modules'];
    const adminModules = await prisma.module.findMany({ where: { name: { in: adminModuleNames } } });
    const adminModuleIds = adminModules.map((m) => m.id);
    if (adminModuleIds.length > 0) {
        await prisma.employeeModule.deleteMany({ where: { moduleId: { in: adminModuleIds } } });
        await prisma.module.deleteMany({ where: { id: { in: adminModuleIds } } });
    }
    for (const provider of staticProviders) {
        await prisma.provider.upsert({
            where: { id: provider.id },
            update: { name: provider.name, tableKey: provider.tableKey },
            create: provider,
        });
    }
    for (const mod of modules) {
        await prisma.module.upsert({
            where: { name: mod.name },
            update: {},
            create: mod,
        });
    }
    for (const { moduleNames, password, ...userData } of testUsers) {
        const hashed = await bcrypt.hash(password, 10);
        const employee = await prisma.employee.upsert({
            where: { username: userData.username },
            update: { mustChangePassword: userData.mustChangePassword },
            create: { ...userData, password: hashed },
        });
        for (const moduleName of moduleNames) {
            const mod = await prisma.module.findUnique({ where: { name: moduleName } });
            if (!mod)
                continue;
            await prisma.employeeModule.upsert({
                where: { employeeId_moduleId: { employeeId: employee.id, moduleId: mod.id } },
                update: {},
                create: { employeeId: employee.id, moduleId: mod.id },
            });
        }
    }
    console.log('Seed completed: 5 providers + 8 modules + 4 staff members (admin + 3 test accounts)');
}
if (require.main === module) {
    main()
        .catch((e) => {
        console.error(e);
        process.exit(1);
    })
        .finally(() => prisma.$disconnect());
}
//# sourceMappingURL=seed.js.map