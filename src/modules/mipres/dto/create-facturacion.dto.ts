import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator'

/**
 * Payload SISPRO PutFacturacion (Tx -1-, WSFACMIPRESNOPBS). El frontend arma
 * los 16 campos cruzando direccionamiento + reporte de entrega + inputs del
 * usuario. El backend solo valida y reenvía.
 *
 * Campos string (incluso los numéricos como ValorEntregado) por convención del
 * swagger SISPRO. Solo NoSubEntrega, NoEntrega y ConTec van como número.
 */
export class CreateFacturacionDto {
  @IsString()
  @IsNotEmpty()
  NoPrescripcion!: string

  @IsString()
  @IsNotEmpty()
  TipoTec!: string

  @IsInt()
  @Min(0)
  ConTec!: number

  @IsString()
  @IsNotEmpty()
  TipoIDPaciente!: string

  @IsString()
  @IsNotEmpty()
  NoIDPaciente!: string

  @IsInt()
  @Min(0)
  NoEntrega!: number

  @IsInt()
  @Min(0)
  NoSubEntrega!: number

  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'NoFactura must be alphanumeric (letters, digits, _ or -)',
  })
  NoFactura!: string

  @IsString()
  @IsNotEmpty()
  NoIDEPS!: string

  @IsString()
  @IsNotEmpty()
  CodEPS!: string

  @IsString()
  @IsNotEmpty()
  CodSerTecAEntregado!: string

  @Matches(/^\d+$/, { message: 'CantUnMinDis must be digits only' })
  CantUnMinDis!: string

  @Matches(/^\d{1,10}$/, {
    message: 'ValorUnitFacturado must be 1-10 digits (no decimals, no separators)',
  })
  ValorUnitFacturado!: string

  @Matches(/^\d+$/, { message: 'ValorTotFacturado must be digits only' })
  ValorTotFacturado!: string

  @Matches(/^\d+$/, { message: 'CuotaModer must be digits only' })
  CuotaModer!: string

  @Matches(/^\d+$/, { message: 'Copago must be digits only' })
  Copago!: string

  /** IDReporteEntrega. Solo para la persistencia local (actualizar billing_id +
   *  invoice_code del radicado); NO se envía a SISPRO. */
  @IsString()
  @IsNotEmpty()
  deliveryReportId!: string
}
