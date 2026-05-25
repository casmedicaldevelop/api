import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  it('exposes .user model', () => {
    expect(service.user).toBeDefined();
  });

  it('exposes .module model', () => {
    expect(service.module).toBeDefined();
  });

  it('exposes .userModule model', () => {
    expect(service.userModule).toBeDefined();
  });
});
