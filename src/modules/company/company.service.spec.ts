import { Test } from '@nestjs/testing'
import { Logger, NotFoundException } from '@nestjs/common'
import { CompanyService } from './company.service'
import { PrismaService } from '../../prisma/prisma.service'

/**
 * Observable scenarios for role-aware getCompany():
 *
 * SCEN-1: Internal callers (no role arg) get the full Company object.
 *         Backstop: mipres.service calls getCompany() with no args and
 *         needs tokenAuth to call SISPRO. Filtering here would break it.
 *
 * SCEN-2: ADMIN role gets the full Company object. The Empresa screen
 *         (admin only) needs every field, including AI keys and tokens.
 *
 * SCEN-3: USER role (or anything other than ADMIN) gets ONLY
 *         { id, name, nit, codeProvider }. The Amarrar button only needs
 *         nit + codeProvider; secrets must never leak to non-admin sessions.
 *
 * SCEN-4: A missing company row throws NotFoundException for any role.
 */
describe('CompanyService.getCompany — role-aware filtering', () => {
  let service: CompanyService
  let prismaMock: { company: { findUnique: jest.Mock } }

  const fullCompany = {
    id: 'singleton',
    name: 'CASMEDICAL S.A.S',
    nit: '901577372',
    email: 'correo@correo.com',
    phone: '3224544434',
    city: 'bogota',
    address: 'calle 123',
    codeProvider: 'PROV007972',
    tokenCompany: 'SECRET_TOKEN_COMPANY',
    tokenAuth: 'SECRET_TOKEN_AUTH',
    aiApiKey: 'SECRET_AI_KEY',
    aiModel: 'gpt-4',
    createdAt: new Date('2026-05-25T00:00:00Z'),
    updatedAt: new Date('2026-05-29T12:30:00Z'),
  }

  beforeEach(async () => {
    prismaMock = { company: { findUnique: jest.fn() } }
    const moduleRef = await Test.createTestingModule({
      providers: [CompanyService, { provide: PrismaService, useValue: prismaMock }],
    }).compile()
    service = moduleRef.get(CompanyService)
  })

  it('SCEN-1: internal caller (no role arg) receives full object including secrets', async () => {
    prismaMock.company.findUnique.mockResolvedValue(fullCompany)
    const result = await service.getCompany()
    expect(result).toEqual(fullCompany)
    expect((result as typeof fullCompany).tokenAuth).toBe('SECRET_TOKEN_AUTH')
  })

  it('SCEN-2: ADMIN role receives full object including secrets', async () => {
    prismaMock.company.findUnique.mockResolvedValue(fullCompany)
    const result = await service.getCompany('ADMIN')
    expect(result).toEqual(fullCompany)
    expect((result as typeof fullCompany).tokenCompany).toBe('SECRET_TOKEN_COMPANY')
  })

  it('SCEN-3: USER role receives only public fields, no secrets', async () => {
    prismaMock.company.findUnique.mockResolvedValue(fullCompany)
    const result = (await service.getCompany('USER')) as Record<string, unknown>
    expect(result).toEqual({
      id: 'singleton',
      name: 'CASMEDICAL S.A.S',
      nit: '901577372',
      codeProvider: 'PROV007972',
    })
    expect(result.tokenCompany).toBeUndefined()
    expect(result.tokenAuth).toBeUndefined()
    expect(result.aiApiKey).toBeUndefined()
    expect(result.email).toBeUndefined()
  })

  it('SCEN-3b: unknown non-ADMIN role is treated like USER (no secret leak)', async () => {
    prismaMock.company.findUnique.mockResolvedValue(fullCompany)
    const result = (await service.getCompany('AUXILIAR')) as Record<string, unknown>
    expect(Object.keys(result).sort()).toEqual(['codeProvider', 'id', 'name', 'nit'])
  })

  it('SCEN-4: missing company row throws NotFoundException for any role', async () => {
    prismaMock.company.findUnique.mockResolvedValue(null)
    await expect(service.getCompany()).rejects.toBeInstanceOf(NotFoundException)
    await expect(service.getCompany('ADMIN')).rejects.toBeInstanceOf(NotFoundException)
    await expect(service.getCompany('USER')).rejects.toBeInstanceOf(NotFoundException)
  })
})

describe('CompanyService.generateMipresToken', () => {
  let service: CompanyService
  let prismaMock: { company: { findUnique: jest.Mock; update: jest.Mock } }

  beforeEach(async () => {
    prismaMock = {
      company: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile()

    service = moduleRef.get(CompanyService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('throws if NIT is not configured', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ nit: null, tokenCompany: 'x' })
    await expect(service.generateMipresToken()).rejects.toThrow(/NIT o Token Empresa/)
  })

  it('throws if tokenCompany is not configured', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ nit: '900', tokenCompany: null })
    await expect(service.generateMipresToken()).rejects.toThrow(/NIT o Token Empresa/)
  })

  it('includes SISPRO response body in the thrown error when MIPRES returns non-2xx', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ nit: '901577372', tokenCompany: 'tok-uuid' })
    const sisproBody = JSON.stringify({ Message: 'TOKEN INVÁLIDO tok-uuid O NIT INCORRECTO 901577372' })
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => sisproBody,
      json: async () => JSON.parse(sisproBody),
    } as unknown as Response)
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})

    await expect(service.generateMipresToken()).rejects.toThrow(/MIPRES respondió 400: TOKEN INVÁLIDO/)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalled()
    const loggedArg = errorSpy.mock.calls[0][0] as string
    expect(loggedArg).toContain('400')
    expect(loggedArg).toContain('TOKEN INVÁLIDO')
  })

  it('builds the SISPRO URL with raw nit and tokenCompany (no encoding wrapper)', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ nit: '901577372', tokenCompany: '865E5C5D-FB56-4D24-95F3-D00B42453CF1' })
    prismaMock.company.update.mockResolvedValue({})
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => 'tok',
      text: async () => '"tok"',
    } as unknown as Response)

    await service.generateMipresToken()

    const calledUrl = fetchMock.mock.calls[0][0] as string
    expect(calledUrl).toBe(
      'https://wsmipres.sispro.gov.co/WSSUMMIPRESNOPBS/api/GenerarToken/901577372/865E5C5D-FB56-4D24-95F3-D00B42453CF1',
    )
  })

  it('persists tokenAuth and returns it on 200', async () => {
    prismaMock.company.findUnique.mockResolvedValue({ nit: '901577372', tokenCompany: 'tok' })
    prismaMock.company.update.mockResolvedValue({})
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => 'fresh-auth-token',
      text: async () => '"fresh-auth-token"',
    } as unknown as Response)

    const result = await service.generateMipresToken()
    expect(result).toBe('fresh-auth-token')
    expect(prismaMock.company.update).toHaveBeenCalledWith({
      where: { id: 'singleton' },
      data: { tokenAuth: 'fresh-auth-token' },
    })
  })
})
