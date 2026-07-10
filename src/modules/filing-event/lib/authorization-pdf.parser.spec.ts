import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseAuthorizationPdf, type OcrData } from './authorization-pdf.parser'

/**
 * Escenarios observables OCR-1..OCR-6 del plan: el parser determinista debe reconstruir
 * EXACTAMENTE la Autorización de servicios de los 2 PDF reales (JasperReports), con el mismo
 * shape que hoy consume el wizard de registro. Igualdad exacta = definición de "hecho".
 */
const ROOT = resolve(__dirname, '../../../../..')
const pdf = (name: string) => readFileSync(resolve(ROOT, name))

describe('parseAuthorizationPdf', () => {
  // OCR-1
  it('extrae 1415512.pdf (3 servicios) con igualdad exacta', async () => {
    const data = await parseAuthorizationPdf(pdf('reporte_autorizacion_prestado1415512.pdf'))
    const expected: OcrData = {
      numero_autorizacion: '1281344',
      codigo_remitente: '891855029',
      nombre_remitente: 'HOSPITAL REGIONAL DE LA ORINOQUIA E.S.E',
      fecha_orden_medica: '2026-05-27',
      fecha_solicitud_ips: '2026-06-24',
      fecha_autorizacion: '2026-06-24',
      diagnostico_principal: 'G409',
      afiliado: {
        tipo_documento: 'TI',
        numero_documento: '1029651181',
        primer_apellido: 'TORRES',
        segundo_apellido: 'LEON',
        primer_nombre: 'JUAN',
        segundo_nombre: 'SEBASTIAN',
        fecha_nacimiento: '2009-02-20',
        categoria: null,
        tipo_afiliado: 'Cabeza',
        direccion_residencia: 'MANZ O LOTE 13',
        telefono: '323-2356220',
        celular: '3142494696',
        departamento: 'Casanare',
        municipio: 'Yopal',
        correo: 'sandraleonparra03@gmail.com',
      },
      servicios: [
        { codigo: '104739-2', cantidad: 90, descripcion: 'ACIDO VALPROICO 500MG TAB LIB RET FCOX30 CX1 (VALCOTE)', observacion: 'DESCONTAR PGP FASALUD' },
        { codigo: '20007896-10', cantidad: 120, descripcion: 'CEUMID - LEVETIRACETAM 500 MG TABLETA RECUBIERTA', observacion: 'DESCONTAR PGP FASALUD' },
        { codigo: '20137719-1', cantidad: 60, descripcion: 'LACOSAMIDA 50 MG', observacion: 'DESCONTAR PGP FASALUD' },
      ],
    }
    expect(data).toEqual(expected)
  })

  // OCR-2
  it('extrae 1415664.pdf (1 servicio) con igualdad exacta', async () => {
    const data = await parseAuthorizationPdf(pdf('reporte_autorizacion_prestado1415664.pdf'))
    const expected: OcrData = {
      numero_autorizacion: '1281494',
      codigo_remitente: '844004197',
      nombre_remitente: 'RED SALUD CASANARE EMPRESA SOCIAL DEL ESTADO',
      fecha_orden_medica: '2026-05-20',
      fecha_solicitud_ips: '2026-06-24',
      fecha_autorizacion: '2026-06-24',
      diagnostico_principal: 'N391',
      afiliado: {
        tipo_documento: 'CC',
        numero_documento: '7230456',
        primer_apellido: 'SANCHEZ',
        segundo_apellido: 'SANABRIA',
        primer_nombre: 'JOSE',
        segundo_nombre: 'ISIDORO',
        fecha_nacimiento: '1959-04-22',
        categoria: null,
        tipo_afiliado: 'Cabeza',
        direccion_residencia: 'VEREDA MARENAO',
        telefono: '314-2845892',
        celular: '3142845892',
        departamento: 'Casanare',
        municipio: 'Monterrey',
        correo: 'hildasanchez487@gmail.com',
      },
      servicios: [
        { codigo: '20088574-1', cantidad: 60, descripcion: 'SACUBITRIL+VALSARTAN 50MG TAB CX30 (ENTRESTO)', observacion: 'EXCLUIDO CAPITA' },
      ],
    }
    expect(data).toEqual(expected)
  })

  // OCR-3: fechas YYYY-MM-DD sin hora (validado en los expected de arriba: FECHA SOLICITUD/AUTORIZACIÓN traen hora en el PDF).

  // OCR-6: documento fuera de plantilla → error claro.
  it('lanza si el PDF no es la plantilla esperada', async () => {
    const notAuth = Buffer.from('%PDF-1.4 not an authorization', 'utf8')
    await expect(parseAuthorizationPdf(notAuth)).rejects.toThrow()
  })
})
