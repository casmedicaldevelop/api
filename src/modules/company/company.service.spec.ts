import { Test } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import { CompanyService } from './company.service'
import { PrismaService } from '../../prisma/prisma.service'

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
