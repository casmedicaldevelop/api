import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  miPresDireccionId!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codSerTecEntregado!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  cantTotEntregada!: string

  @IsInt()
  @IsIn([1, 2])
  entTotal!: number

  @IsInt()
  @Min(0)
  @Max(99)
  causaNoEntrega!: number

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecEntrega must be YYYY-MM-DD' })
  fecEntrega!: string

  @IsString()
  @MaxLength(20)
  noLote!: string

  @IsString()
  @MaxLength(2)
  tipoIdRecibe!: string

  @IsString()
  @MaxLength(17)
  noIdRecibe!: string
}
