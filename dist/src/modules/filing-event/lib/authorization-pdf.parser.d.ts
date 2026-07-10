export interface OcrAfiliado {
    tipo_documento: string | null;
    numero_documento: string | null;
    primer_apellido: string | null;
    segundo_apellido: string | null;
    primer_nombre: string | null;
    segundo_nombre: string | null;
    fecha_nacimiento: string | null;
    categoria: string | null;
    tipo_afiliado: string | null;
    direccion_residencia: string | null;
    telefono: string | null;
    celular: string | null;
    departamento: string | null;
    municipio: string | null;
    correo: string | null;
}
export interface OcrServicio {
    codigo: string | null;
    cantidad: number | null;
    descripcion: string | null;
    observacion: string | null;
}
export interface OcrData {
    numero_autorizacion: string | null;
    codigo_remitente: string | null;
    nombre_remitente: string | null;
    fecha_orden_medica: string | null;
    fecha_solicitud_ips: string | null;
    fecha_autorizacion: string | null;
    diagnostico_principal: string | null;
    afiliado: OcrAfiliado;
    servicios: OcrServicio[];
}
export declare function parseAuthorizationPdf(buffer: Buffer): Promise<OcrData>;
