import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class CreateDeliveryReportDto {
  @IsString()
  @IsNotEmpty()
  miPresEntregaId!: string

  /** IDEntrega de la entrega. Se usa solo para la persistencia local
   *  (actualizar delivery_report_id del radicado), no se envía a SISPRO. */
  @IsString()
  @IsNotEmpty()
  deliveryId!: string

  /**
   * SISPRO expects `ValorEntregado` as a string of digits (no decimals, no
   * thousand separators). The regex blocks anything other than digits.
   */
  @IsString()
  @Matches(/^\d+$/, { message: 'valorEntregado must contain digits only (no decimals, no separators)' })
  valorEntregado!: string
}
