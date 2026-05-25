import { Test } from '@nestjs/testing';
import * as xlsx from 'xlsx';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../../prisma/prisma.service';

function makeFile(rows: object[]): Express.Multer.File {
  const ws = xlsx.utils.json_to_sheet(rows);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  return {
    buffer,
    originalname: 'test.xlsx',
    mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: buffer.length,
    fieldname: 'file',
    encoding: '7bit',
    stream: null as never,
    destination: '',
    filename: 'test.xlsx',
    path: '',
  } as Express.Multer.File;
}

const ROW = (code: string, suffix = '') => ({
  code,
  product: `Producto ${code}${suffix}`,
  iva: 'SI',
  cum: '',
  price_box: 1000,
  price_unit: 100,
  stop_box: 900,
});

describe('ProvidersService — bulkUpload', () => {
  let service: ProvidersService;

  const mockDelegate = {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    findUnique: jest.fn().mockResolvedValue(null),
    update: jest.fn(),
    upsert: jest.fn().mockResolvedValue({ code: 'X' }),
    deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    createMany: jest.fn().mockResolvedValue({ count: 0 }),
  };

  const mockPrisma = {
    provider: {
      findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Test', tableKey: 'provider1', address: null, phone: null, description: null }),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    provider1: mockDelegate,
    provider2: mockDelegate,
    provider3: mockDelegate,
    provider4: mockDelegate,
    provider5: mockDelegate,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<ProvidersService>(ProvidersService);
  });

  describe('upload mode — duplicate codes in file', () => {
    it('does NOT throw — processes the batch and skips duplicate codes', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-001', '-bis')]);
      await expect(service.bulkUpload(1, file, 'upload')).resolves.not.toThrow();
    });

    it('calls deleteMany (truncate still happens)', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-001', '-bis')]);
      await service.bulkUpload(1, file, 'upload');
      expect(mockDelegate.deleteMany).toHaveBeenCalledTimes(1);
    });

    it('calls createMany with only the first occurrence of each code', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-001', '-bis'), ROW('PROD-002')]);
      await service.bulkUpload(1, file, 'upload');
      const calledWith = mockDelegate.createMany.mock.calls[0][0].data as { code: string }[];
      expect(calledWith.map((r) => r.code)).toEqual(['PROD-001', 'PROD-002']);
    });

    it('returns correct inserted and skipped counts', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-001', '-bis'), ROW('PROD-002')]);
      const result = await service.bulkUpload(1, file, 'upload');
      expect(result).toMatchObject({ inserted: 2, skipped: 1, total: 3, mode: 'upload' });
    });

    it('handles case-insensitive duplicates (PROD-001 vs prod-001)', async () => {
      const file = makeFile([
        { ...ROW('PROD-001'), code: 'PROD-001' },
        { ...ROW('PROD-001'), code: 'prod-001' },
      ]);
      const result = await service.bulkUpload(1, file, 'upload');
      expect(result).toMatchObject({ inserted: 1, skipped: 1 });
    });
  });

  describe('upload mode — all unique codes', () => {
    it('inserts all records and reports 0 skipped', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-002'), ROW('PROD-003')]);
      const result = await service.bulkUpload(1, file, 'upload');
      expect(result).toMatchObject({ inserted: 3, skipped: 0, total: 3, mode: 'upload' });
    });
  });

  describe('update mode', () => {
    it('upserts all records regardless of duplicates in file', async () => {
      const file = makeFile([ROW('PROD-001'), ROW('PROD-002')]);
      const result = await service.bulkUpload(1, file, 'update');
      expect(result).toMatchObject({ total: 2, mode: 'update' });
      expect(mockDelegate.upsert).toHaveBeenCalledTimes(2);
    });
  });
});
