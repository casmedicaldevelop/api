import PDFParser from 'pdf2json'

/**
 * Parser determinista de la "Autorización de servicios" (JasperReports + iText).
 * El PDF es digital (capa de texto vectorial) y la plantilla es FIJA: reconstruimos
 * el documento por coordenadas (y = fila, x = columna) y leemos cada campo por ancla
 * de etiqueta. Reemplaza la extracción por IA (Gemini) manteniendo el MISMO shape de salida.
 */

export interface OcrAfiliado {
  tipo_documento: string | null
  numero_documento: string | null
  primer_apellido: string | null
  segundo_apellido: string | null
  primer_nombre: string | null
  segundo_nombre: string | null
  fecha_nacimiento: string | null
  categoria: string | null
  tipo_afiliado: string | null
  direccion_residencia: string | null
  telefono: string | null
  celular: string | null
  departamento: string | null
  municipio: string | null
  correo: string | null
}

export interface OcrServicio {
  codigo: string | null
  cantidad: number | null
  descripcion: string | null
  observacion: string | null
}

export interface OcrData {
  numero_autorizacion: string | null
  codigo_remitente: string | null
  nombre_remitente: string | null
  fecha_orden_medica: string | null
  fecha_solicitud_ips: string | null
  fecha_autorizacion: string | null
  diagnostico_principal: string | null
  afiliado: OcrAfiliado
  servicios: OcrServicio[]
}

interface Frag {
  x: number
  text: string
}
interface Row {
  y: number
  frags: Frag[] // ordenados por x (izquierda→derecha)
}

/** Tolerancia vertical para considerar que dos fragmentos están en la misma fila. */
const ROW_TOL = 0.35

/** Límites de columna (coordenada x de pdf2json) de la tabla SERVICIOS AUTORIZADOS. */
const SVC_COL = {
  codigo: [2.5, 6.5],
  cantidad: [6.5, 9.5],
  descripcion: [9.5, 22.5],
  observacion: [22.5, Infinity],
} as const

/** Etiqueta de encabezado del afiliado → clave de salida. */
const AFILIADO_HEADERS: { label: string; key: keyof OcrAfiliado }[] = [
  { label: 'Tipo Documento', key: 'tipo_documento' },
  { label: 'Número Documento', key: 'numero_documento' },
  { label: '1er Apellido', key: 'primer_apellido' },
  { label: '2do Apellido', key: 'segundo_apellido' },
  { label: '1er Nombre', key: 'primer_nombre' },
  { label: '2do Nombre', key: 'segundo_nombre' },
  { label: 'Fecha Nacimiento', key: 'fecha_nacimiento' },
  { label: 'Categoría', key: 'categoria' },
  { label: 'Tipo Afiliado', key: 'tipo_afiliado' },
]

const clean = (s: string | null | undefined): string | null => {
  const t = (s ?? '').trim()
  return t.length ? t : null
}

/** Recorta la hora dejando solo YYYY-MM-DD (o null). */
const dateOnly = (s: string | null | undefined): string | null => {
  const t = clean(s)
  if (!t) return null
  const m = t.match(/(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : t
}

/** Agrupa fragmentos de una página en filas por coordenada y (con tolerancia). */
function buildRows(texts: { x: number; y: number; R: { T: string }[] }[]): Row[] {
  const frags = texts
    .map((t) => ({
      x: t.x,
      y: t.y,
      text: t.R.map((r) => decodeURIComponent(r.T)).join(''),
    }))
    .filter((f) => f.text.trim().length > 0)

  const rows: Row[] = []
  for (const f of frags.sort((a, b) => a.y - b.y || a.x - b.x)) {
    const row = rows.find((r) => Math.abs(r.y - f.y) <= ROW_TOL)
    if (row) row.frags.push({ x: f.x, text: f.text })
    else rows.push({ y: f.y, frags: [{ x: f.x, text: f.text }] })
  }
  for (const r of rows) r.frags.sort((a, b) => a.x - b.x)
  return rows.sort((a, b) => a.y - b.y)
}

/** Primera fila cuyo algún fragmento incluye `needle`. */
function findRow(rows: Row[], needle: string): Row | undefined {
  return rows.find((r) => r.frags.some((f) => f.text.includes(needle)))
}

/** Valor a la derecha de la etiqueta `label` dentro de una fila (fragmento siguiente). */
function valueRightOf(row: Row | undefined, label: string): string | null {
  if (!row) return null
  const idx = row.frags.findIndex((f) => f.text.includes(label))
  if (idx < 0 || idx + 1 >= row.frags.length) return null
  return clean(row.frags[idx + 1].text)
}

function parseAfiliado(rows: Row[]): OcrAfiliado {
  const afiliado: OcrAfiliado = {
    tipo_documento: null,
    numero_documento: null,
    primer_apellido: null,
    segundo_apellido: null,
    primer_nombre: null,
    segundo_nombre: null,
    fecha_nacimiento: null,
    categoria: null,
    tipo_afiliado: null,
    direccion_residencia: null,
    telefono: null,
    celular: null,
    departamento: null,
    municipio: null,
    correo: null,
  }

  // Bloque tabular: fila de etiquetas (contiene "1er Apellido") + la fila de valores inmediatamente debajo.
  const headerRow = findRow(rows, '1er Apellido')
  if (headerRow) {
    const headerXs = AFILIADO_HEADERS.map((h) => ({
      ...h,
      x: headerRow.frags.find((f) => f.text.includes(h.label))?.x ?? null,
    })).filter((h) => h.x !== null) as { label: string; key: keyof OcrAfiliado; x: number }[]

    const valueRow = rows.find((r) => r.y > headerRow.y && r.y - headerRow.y <= 1.4)
    if (valueRow) {
      for (const frag of valueRow.frags) {
        // Cada valor va a la columna cuyo x de encabezado esté más cerca (columnas vacías quedan null).
        let best: { key: keyof OcrAfiliado; d: number } | null = null
        for (const h of headerXs) {
          const d = Math.abs(h.x - frag.x)
          if (!best || d < best.d) best = { key: h.key, d }
        }
        if (best) {
          const prev = afiliado[best.key]
          afiliado[best.key] = clean(prev ? `${prev} ${frag.text}` : frag.text)
        }
      }
    }
  }
  afiliado.fecha_nacimiento = dateOnly(afiliado.fecha_nacimiento)

  // Bloque etiqueta/valor (direcciones/contacto), anclado por etiqueta.
  const addrRow = findRow(rows, 'Dirección de Residencia Habitual')
  afiliado.direccion_residencia = valueRightOf(addrRow, 'Dirección de Residencia Habitual')
  afiliado.telefono = valueRightOf(addrRow, 'Teléfono:')
  afiliado.celular = valueRightOf(addrRow, 'Celular:')

  const geoRow = findRow(rows, 'Correo Electrónico')
  afiliado.departamento = valueRightOf(geoRow, 'Departamento:')
  afiliado.municipio = valueRightOf(geoRow, 'Municipio:')
  afiliado.correo = valueRightOf(geoRow, 'Correo Electrónico:')

  return afiliado
}

/** Reparte una fila de servicio en las 4 columnas por rangos de x. */
function parseServiceRow(row: Row): OcrServicio | null {
  const bucket = (range: readonly [number, number]) =>
    row.frags
      .filter((f) => f.x >= range[0] && f.x < range[1])
      .map((f) => f.text.trim())
      .join(' ')
      .trim()

  const codigo = bucket(SVC_COL.codigo)
  if (!codigo) return null // no es una fila de datos
  const cantidadRaw = bucket(SVC_COL.cantidad)
  const cantidad = cantidadRaw ? Number.parseInt(cantidadRaw.replace(/\D/g, ''), 10) : null
  return {
    codigo: clean(codigo),
    cantidad: Number.isFinite(cantidad as number) ? (cantidad as number) : null,
    descripcion: clean(bucket(SVC_COL.descripcion)),
    observacion: clean(bucket(SVC_COL.observacion)),
  }
}

/** Servicios de una página: filas entre el encabezado de la tabla y VALOR COPAGO SUBSIDIADO. */
function parsePageServices(rows: Row[]): OcrServicio[] {
  const header = rows.find(
    (r) =>
      r.frags.some((f) => f.text.includes('CÓDIGO')) &&
      r.frags.some((f) => f.text.includes('CANTIDAD')) &&
      r.frags.some((f) => f.text.includes('DESCRIPCIÓN')),
  )
  if (!header) return []
  const footer = rows.find((r) => r.y > header.y && r.frags.some((f) => f.text.includes('VALOR COPAGO')))
  const maxY = footer ? footer.y : Infinity
  const out: OcrServicio[] = []
  for (const r of rows) {
    if (r.y <= header.y || r.y >= maxY) continue
    const svc = parseServiceRow(r)
    if (svc) out.push(svc)
  }
  return out
}

/** Ejecuta pdf2json sobre el buffer y devuelve las páginas con sus Texts. */
function parseWithPdf2json(
  buffer: Buffer,
): Promise<{ Texts: { x: number; y: number; R: { T: string }[] }[] }[]> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null as never, true as never)
    parser.on('pdfParser_dataError', (err: Error | { parserError?: Error }) => {
      const pe = (err as { parserError?: Error })?.parserError
      const msg = pe?.message || (err instanceof Error ? err.message : String(err)) || 'No se pudo leer el PDF.'
      reject(new Error(msg))
    })
    parser.on('pdfParser_dataReady', (data: { Pages: { Texts: { x: number; y: number; R: { T: string }[] }[] }[] }) =>
      resolve(data.Pages ?? []),
    )
    parser.parseBuffer(buffer)
  })
}

/**
 * Extrae la Autorización de servicios de un PDF (buffer) a la estructura OcrData.
 * Lanza si el documento no corresponde a la plantilla esperada.
 */
export async function parseAuthorizationPdf(buffer: Buffer): Promise<OcrData> {
  const pages = await parseWithPdf2json(buffer)
  if (!pages.length) throw new Error('El PDF no contiene texto legible.')

  const pageRows = pages.map((p) => buildRows(p.Texts))
  const rows = pageRows[0] // cabecera/afiliado siempre en la página 1

  // Número de autorización: fragmento "No. 1281344".
  let numero: string | null = null
  for (const r of rows) {
    for (const f of r.frags) {
      const m = f.text.match(/No\.\s*([0-9]+)/)
      if (m) {
        numero = m[1]
        break
      }
    }
    if (numero) break
  }

  // Servicios: recorre TODAS las páginas (si desbordan a la 2ª).
  const servicios = pageRows.flatMap((rs) => parsePageServices(rs))

  const hasServiceTable = pageRows.some((rs) =>
    rs.some(
      (r) =>
        r.frags.some((f) => f.text.includes('CÓDIGO')) &&
        r.frags.some((f) => f.text.includes('DESCRIPCIÓN')),
    ),
  )
  if (!numero || !hasServiceTable) {
    throw new Error('El documento no corresponde a la plantilla de Autorización de servicios esperada.')
  }

  const remRow = findRow(rows, 'Ips Remitente')

  return {
    numero_autorizacion: numero,
    codigo_remitente: valueRightOf(remRow, 'Ips Remitente'),
    nombre_remitente: valueRightOf(remRow, 'Nombre'),
    fecha_orden_medica: dateOnly(valueRightOf(findRow(rows, 'FECHA ORDEN MÉDICA'), 'FECHA ORDEN MÉDICA')),
    fecha_solicitud_ips: dateOnly(valueRightOf(findRow(rows, 'FECHA SOLICITUD IPS'), 'FECHA SOLICITUD IPS')),
    fecha_autorizacion: dateOnly(valueRightOf(findRow(rows, 'FECHA AUTORIZACIÓN'), 'FECHA AUTORIZACIÓN')),
    diagnostico_principal: valueRightOf(remRow, 'Diagnóstico'),
    afiliado: parseAfiliado(rows),
    servicios,
  }
}
