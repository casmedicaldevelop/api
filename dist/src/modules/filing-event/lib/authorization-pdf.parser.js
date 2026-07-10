"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthorizationPdf = parseAuthorizationPdf;
const pdf2json_1 = __importDefault(require("pdf2json"));
const ROW_TOL = 0.35;
const SVC_COL = {
    codigo: [2.5, 6.5],
    cantidad: [6.5, 9.5],
    descripcion: [9.5, 22.5],
    observacion: [22.5, Infinity],
};
const AFILIADO_HEADERS = [
    { label: 'Tipo Documento', key: 'tipo_documento' },
    { label: 'Número Documento', key: 'numero_documento' },
    { label: '1er Apellido', key: 'primer_apellido' },
    { label: '2do Apellido', key: 'segundo_apellido' },
    { label: '1er Nombre', key: 'primer_nombre' },
    { label: '2do Nombre', key: 'segundo_nombre' },
    { label: 'Fecha Nacimiento', key: 'fecha_nacimiento' },
    { label: 'Categoría', key: 'categoria' },
    { label: 'Tipo Afiliado', key: 'tipo_afiliado' },
];
const clean = (s) => {
    const t = (s ?? '').trim();
    return t.length ? t : null;
};
const dateOnly = (s) => {
    const t = clean(s);
    if (!t)
        return null;
    const m = t.match(/(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : t;
};
function buildRows(texts) {
    const frags = texts
        .map((t) => ({
        x: t.x,
        y: t.y,
        text: t.R.map((r) => decodeURIComponent(r.T)).join(''),
    }))
        .filter((f) => f.text.trim().length > 0);
    const rows = [];
    for (const f of frags.sort((a, b) => a.y - b.y || a.x - b.x)) {
        const row = rows.find((r) => Math.abs(r.y - f.y) <= ROW_TOL);
        if (row)
            row.frags.push({ x: f.x, text: f.text });
        else
            rows.push({ y: f.y, frags: [{ x: f.x, text: f.text }] });
    }
    for (const r of rows)
        r.frags.sort((a, b) => a.x - b.x);
    return rows.sort((a, b) => a.y - b.y);
}
function findRow(rows, needle) {
    return rows.find((r) => r.frags.some((f) => f.text.includes(needle)));
}
function valueRightOf(row, label) {
    if (!row)
        return null;
    const idx = row.frags.findIndex((f) => f.text.includes(label));
    if (idx < 0 || idx + 1 >= row.frags.length)
        return null;
    return clean(row.frags[idx + 1].text);
}
function parseAfiliado(rows) {
    const afiliado = {
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
    };
    const headerRow = findRow(rows, '1er Apellido');
    if (headerRow) {
        const headerXs = AFILIADO_HEADERS.map((h) => ({
            ...h,
            x: headerRow.frags.find((f) => f.text.includes(h.label))?.x ?? null,
        })).filter((h) => h.x !== null);
        const valueRow = rows.find((r) => r.y > headerRow.y && r.y - headerRow.y <= 1.4);
        if (valueRow) {
            for (const frag of valueRow.frags) {
                let best = null;
                for (const h of headerXs) {
                    const d = Math.abs(h.x - frag.x);
                    if (!best || d < best.d)
                        best = { key: h.key, d };
                }
                if (best) {
                    const prev = afiliado[best.key];
                    afiliado[best.key] = clean(prev ? `${prev} ${frag.text}` : frag.text);
                }
            }
        }
    }
    afiliado.fecha_nacimiento = dateOnly(afiliado.fecha_nacimiento);
    const addrRow = findRow(rows, 'Dirección de Residencia Habitual');
    afiliado.direccion_residencia = valueRightOf(addrRow, 'Dirección de Residencia Habitual');
    afiliado.telefono = valueRightOf(addrRow, 'Teléfono:');
    afiliado.celular = valueRightOf(addrRow, 'Celular:');
    const geoRow = findRow(rows, 'Correo Electrónico');
    afiliado.departamento = valueRightOf(geoRow, 'Departamento:');
    afiliado.municipio = valueRightOf(geoRow, 'Municipio:');
    afiliado.correo = valueRightOf(geoRow, 'Correo Electrónico:');
    return afiliado;
}
function parseServiceRow(row) {
    const bucket = (range) => row.frags
        .filter((f) => f.x >= range[0] && f.x < range[1])
        .map((f) => f.text.trim())
        .join(' ')
        .trim();
    const codigo = bucket(SVC_COL.codigo);
    if (!codigo)
        return null;
    const cantidadRaw = bucket(SVC_COL.cantidad);
    const cantidad = cantidadRaw ? Number.parseInt(cantidadRaw.replace(/\D/g, ''), 10) : null;
    return {
        codigo: clean(codigo),
        cantidad: Number.isFinite(cantidad) ? cantidad : null,
        descripcion: clean(bucket(SVC_COL.descripcion)),
        observacion: clean(bucket(SVC_COL.observacion)),
    };
}
function parsePageServices(rows) {
    const header = rows.find((r) => r.frags.some((f) => f.text.includes('CÓDIGO')) &&
        r.frags.some((f) => f.text.includes('CANTIDAD')) &&
        r.frags.some((f) => f.text.includes('DESCRIPCIÓN')));
    if (!header)
        return [];
    const footer = rows.find((r) => r.y > header.y && r.frags.some((f) => f.text.includes('VALOR COPAGO')));
    const maxY = footer ? footer.y : Infinity;
    const out = [];
    for (const r of rows) {
        if (r.y <= header.y || r.y >= maxY)
            continue;
        const svc = parseServiceRow(r);
        if (svc)
            out.push(svc);
    }
    return out;
}
function parseWithPdf2json(buffer) {
    return new Promise((resolve, reject) => {
        const parser = new pdf2json_1.default(null, true);
        parser.on('pdfParser_dataError', (err) => {
            const pe = err?.parserError;
            const msg = pe?.message || (err instanceof Error ? err.message : String(err)) || 'No se pudo leer el PDF.';
            reject(new Error(msg));
        });
        parser.on('pdfParser_dataReady', (data) => resolve(data.Pages ?? []));
        parser.parseBuffer(buffer);
    });
}
async function parseAuthorizationPdf(buffer) {
    const pages = await parseWithPdf2json(buffer);
    if (!pages.length)
        throw new Error('El PDF no contiene texto legible.');
    const pageRows = pages.map((p) => buildRows(p.Texts));
    const rows = pageRows[0];
    let numero = null;
    for (const r of rows) {
        for (const f of r.frags) {
            const m = f.text.match(/No\.\s*([0-9]+)/);
            if (m) {
                numero = m[1];
                break;
            }
        }
        if (numero)
            break;
    }
    const servicios = pageRows.flatMap((rs) => parsePageServices(rs));
    const hasServiceTable = pageRows.some((rs) => rs.some((r) => r.frags.some((f) => f.text.includes('CÓDIGO')) &&
        r.frags.some((f) => f.text.includes('DESCRIPCIÓN'))));
    if (!numero || !hasServiceTable) {
        throw new Error('El documento no corresponde a la plantilla de Autorización de servicios esperada.');
    }
    const remRow = findRow(rows, 'Ips Remitente');
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
    };
}
//# sourceMappingURL=authorization-pdf.parser.js.map