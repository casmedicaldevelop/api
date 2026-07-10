import { IsNotEmpty, IsString, Matches } from 'class-validator'

/**
 * Datos de cierre de la radicación, capturados desde la pantalla de detalle
 * cuando las etapas previas (entrega, reporte, facturación) están completas.
 */
export class UpdateRadicacionDto {
  // F. Factura → invoice_date.
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'invoiceDate debe tener formato YYYY-MM-DD' })
  invoiceDate!: string

  @IsString()
  @IsNotEmpty()
  cufe!: string

  // Radicado → filing_code.
  @IsString()
  @IsNotEmpty()
  filingCode!: string
}
