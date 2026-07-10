import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  it('admin user has role ADMINISTRADOR and mustChangePassword true', async () => {
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
    expect(admin?.role).toBe('ADMINISTRADOR');
    expect(admin?.mustChangePassword).toBe(true);
  });

  it('admin password is a bcrypt hash (not plaintext)', async () => {
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
    expect(admin?.password).toMatch(/^\$2[ab]\$/);
    const valid = await bcrypt.compare('Admin123!', admin!.password);
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
