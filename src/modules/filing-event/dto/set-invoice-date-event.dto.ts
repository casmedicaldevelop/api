import { Matches } from 'class-validator'

export class SetInvoiceDateEventDto {
  // Fecha con la que se imprimen factura y ticket del lote. Formato YYYY-MM-DD.
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'invoiceDate debe tener formato YYYY-MM-DD' })
  invoiceDate!: string
}
