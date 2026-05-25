import { MipresService } from './mipres.service';
import { ConfigService } from '@nestjs/config';
import { CompanyService } from '../company/company.service';
import { UsersService } from '../users/users.service';

/**
 * Scenarios for getPrescriptionWorkspace:
 *  S1 — Empty SISPRO response → returns { routings: [], patient: null }
 *  S2 — SISPRO returns array, patient exists in DB → patient.exists = true with user
 *  S3 — SISPRO returns array, patient missing in DB → patient.exists = false with fromMipres data
 *  S4 — SISPRO returns single object (not array) → normalized into array
 */
describe('MipresService — getPrescriptionWorkspace', () => {
  let service: MipresService;
  const config = { get: jest.fn().mockReturnValue('https://example.test') } as unknown as ConfigService;
  const company = { getCompany: jest.fn() } as unknown as CompanyService;
  const users = { findOneOrNull: jest.fn() } as unknown as UsersService;

  beforeEach(() => {
    service = new MipresService(config, company, users);
  });

  it('S1 — empty array returns null patient', async () => {
    jest.spyOn(service, 'getRoutingsByPrescription').mockResolvedValue([] as never);
    const out = await service.getPrescriptionWorkspace('PX1');
    expect(out).toEqual({ prescriptionNumber: 'PX1', routings: [], patient: null });
  });

  it('S2 — patient found in DB', async () => {
    const routing = { NoIDPaciente: '123', TipoIDPaciente: 'CC', DirPaciente: 'Cra 1' };
    jest.spyOn(service, 'getRoutingsByPrescription').mockResolvedValue([routing] as never);
    (users.findOneOrNull as jest.Mock).mockResolvedValue({ id: '123', firstName: 'Ana' });
    const out = await service.getPrescriptionWorkspace('PX2');
    expect(out.patient).toEqual({ exists: true, user: { id: '123', firstName: 'Ana' } });
  });

  it('S3 — patient missing falls back to MIPRES data', async () => {
    const routing = { NoIDPaciente: '999', TipoIDPaciente: 'CC', DirPaciente: 'Calle 5' };
    jest.spyOn(service, 'getRoutingsByPrescription').mockResolvedValue([routing] as never);
    (users.findOneOrNull as jest.Mock).mockResolvedValue(null);
    const out = await service.getPrescriptionWorkspace('PX3');
    expect(out.patient).toEqual({
      exists: false,
      fromMipres: { tipoDoc: 'CC', noDoc: '999', address: 'Calle 5' },
    });
  });

  it('S4 — single-object response normalized to array', async () => {
    const routing = { NoIDPaciente: '777', TipoIDPaciente: 'CC', DirPaciente: 'Av 9' };
    jest.spyOn(service, 'getRoutingsByPrescription').mockResolvedValue(routing as never);
    (users.findOneOrNull as jest.Mock).mockResolvedValue(null);
    const out = await service.getPrescriptionWorkspace('PX4');
    expect(Array.isArray(out.routings)).toBe(true);
    expect(out.routings).toHaveLength(1);
  });
});

/**
 * Scenarios for delivery proxy methods:
 *  D1 — createDelivery converts miPresDireccionId to numeric ID and maps the
 *       other camelCase fields to SISPRO PascalCase before calling PUT /api/Entrega.
 *  D2 — getDeliveriesByPrescription calls GET /api/EntregaXPrescripcion with
 *       the prescription number url-encoded into the path.
 *  D3 — cancelDelivery calls PUT /api/AnularEntrega/{nit}/{token}/{id} with the
 *       delivery id url-encoded.
 */
describe('MipresService — delivery proxy methods', () => {
  let service: MipresService;
  const baseUrl = 'https://example.test';
  const config = { get: jest.fn().mockReturnValue(baseUrl) } as unknown as ConfigService;
  const company = { getCompany: jest.fn() } as unknown as CompanyService;
  const users = { findOneOrNull: jest.fn() } as unknown as UsersService;

  beforeEach(() => {
    (company.getCompany as jest.Mock).mockResolvedValue({ nit: 'NIT-1', tokenAuth: 'TOKEN-1' });
    service = new MipresService(config, company, users);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
      text: async () => '',
    }) as unknown as typeof fetch;
  });

  it('D1 — createDelivery PUTs PascalCase body with numeric ID to /api/Entrega', async () => {
    await service.createDelivery({
      miPresDireccionId: '847312',
      codSerTecEntregado: '19842211-1',
      cantTotEntregada: '8',
      entTotal: 1,
      causaNoEntrega: 0,
      fecEntrega: '2026-05-15',
      noLote: 'LT-A3128',
      tipoIdRecibe: 'CC',
      noIdRecibe: '1024587301',
    });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${baseUrl}/api/Entrega/NIT-1/TOKEN-1`);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body)).toEqual({
      ID: 847312,
      CodSerTecEntregado: '19842211-1',
      CantTotEntregada: '8',
      EntTotal: 1,
      CausaNoEntrega: 0,
      FecEntrega: '2026-05-15',
      NoLote: 'LT-A3128',
      TipoIDRecibe: 'CC',
      NoIDRecibe: '1024587301',
    });
  });

  it('D2 — getDeliveriesByPrescription GETs /api/EntregaXPrescripcion with encoded prescription', async () => {
    await service.getDeliveriesByPrescription('1234567890');
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${baseUrl}/api/EntregaXPrescripcion/NIT-1/TOKEN-1/1234567890`);
    expect(init.method).toBe('GET');
  });

  it('D3 — cancelDelivery PUTs /api/AnularEntrega with encoded id', async () => {
    await service.cancelDelivery('4881412');
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${baseUrl}/api/AnularEntrega/NIT-1/TOKEN-1/4881412`);
    expect(init.method).toBe('PUT');
  });

  it('D4 — createDeliveryReport PUTs /api/ReporteEntrega hardcoding EstadoEntrega=1 and CausaNoEntrega=0', async () => {
    await service.createDeliveryReport({
      miPresEntregaId: '109771175',
      valorEntregado: '12345',
    });
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${baseUrl}/api/ReporteEntrega/NIT-1/TOKEN-1`);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body)).toEqual({
      ID: 109771175,
      EstadoEntrega: 1,
      CausaNoEntrega: 0,
      ValorEntregado: '12345',
    });
  });

  it('D5 — getDeliveryReportsByPrescription GETs /api/ReporteEntregaXPrescripcion with encoded prescription', async () => {
    await service.getDeliveryReportsByPrescription('20260409118000884172');
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      `${baseUrl}/api/ReporteEntregaXPrescripcion/NIT-1/TOKEN-1/20260409118000884172`,
    );
    expect(init.method).toBe('GET');
  });

  it('D6 — cancelDeliveryReport PUTs /api/AnularReporteEntrega with encoded id', async () => {
    await service.cancelDeliveryReport('88187943');
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${baseUrl}/api/AnularReporteEntrega/NIT-1/TOKEN-1/88187943`);
    expect(init.method).toBe('PUT');
  });
});

/**
 * Scenarios for createFacturacion (passthrough a WSFACMIPRESNOPBS):
 *  F1 — recibe los 16 campos PascalCase y hace UN solo PUT al facBaseUrl con
 *       el body intacto. Cero GETs preparatorios. El armado/cruce vive en el
 *       frontend (igual patrón que createSchedule/createDelivery).
 */
describe('MipresService — createFacturacion (passthrough)', () => {
  let service: MipresService;
  const sumBaseUrl = 'https://sum.test';
  const facBaseUrl = 'https://fac.test';
  const config = {
    get: jest.fn((key: string, def?: unknown) => {
      if (key === 'MIPRES_API_URL') return sumBaseUrl;
      if (key === 'MIPRES_FAC_API_URL') return facBaseUrl;
      return def;
    }),
  } as unknown as ConfigService;
  const company = { getCompany: jest.fn() } as unknown as CompanyService;
  const users = { findOneOrNull: jest.fn() } as unknown as UsersService;

  beforeEach(() => {
    (company.getCompany as jest.Mock).mockResolvedValue({ nit: 'NIT-1', tokenAuth: 'TOKEN-1' });
    service = new MipresService(config, company, users);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ IDFacturacion: 555 }],
      text: async () => '',
    }) as unknown as typeof fetch;
  });

  it('F1 — PUT único al facBaseUrl con el payload intacto, sin GETs preparatorios', async () => {
    const payload = {
      NoPrescripcion: '20260409118000884172',
      TipoTec: 'N',
      ConTec: 1,
      TipoIDPaciente: 'CC',
      NoIDPaciente: '23827101',
      NoEntrega: 1,
      NoSubEntrega: 0,
      NoFactura: 'FAC-A1928',
      NoIDEPS: '891856000',
      CodEPS: 'EPS025',
      CodSerTecAEntregado: '141001',
      CantUnMinDis: '60',
      ValorUnitFacturado: '16667',
      ValorTotFacturado: '1000000',
      CuotaModer: '0',
      Copago: '0',
    };

    const result = await service.createFacturacion(payload);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${facBaseUrl}/api/Facturacion/NIT-1/TOKEN-1`);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body)).toEqual(payload);
    expect(result).toEqual([{ IDFacturacion: 555 }]);
  });

  it('F2 — getFacturacionesByPrescription GET al facBaseUrl con prescripción encoded', async () => {
    await service.getFacturacionesByPrescription('20260409118000884172');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${facBaseUrl}/api/FacturacionXPrescripcion/NIT-1/TOKEN-1/20260409118000884172`);
    expect(init.method).toBe('GET');
  });

  it('F3 — cancelFacturacion PUT a /api/FacturacionAnular con id encoded', async () => {
    await service.cancelFacturacion('555');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${facBaseUrl}/api/FacturacionAnular/NIT-1/TOKEN-1/555`);
    expect(init.method).toBe('PUT');
  });
});
