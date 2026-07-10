import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'

export class RegisterDeliveryEventDto {
  @IsIn(['COMPLETA', 'PARCIAL', 'SIN_EXISTENCIAS'])
  deliveryType!: 'COMPLETA' | 'PARCIAL' | 'SIN_EXISTENCIAS'

  // Requerido solo en PARCIAL (1..pendiente). En COMPLETA se toma todo el pendiente; en SIN_EXISTENCIAS es 0.
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number

  @IsString()
  @IsOptional()
  comment?: string
}
