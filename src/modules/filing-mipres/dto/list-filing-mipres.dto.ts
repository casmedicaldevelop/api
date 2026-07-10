import { Type } from 'class-transformer'
import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class ListFilingMipresDto {
  @IsString()
  @IsOptional()
  search?: string

  // Código de radicación oficial SISPRO (columna filing_code).
  @IsString()
  @IsOptional()
  filingCode?: string

  @IsString()
  @IsOptional()
  userDocument?: string

  @IsString()
  @IsOptional()
  prescriptionNumber?: string

  @IsString()
  @IsOptional()
  status?: string

  @IsString()
  @IsOptional()
  substatus?: string

  // Filtro de fecha de creación: modos EXCLUYENTES. `dateExact` filtra un día;
  // `dateFrom`/`dateTo` filtran un rango inclusive. Formato YYYY-MM-DD.
  @IsDateString()
  @IsOptional()
  dateExact?: string

  @IsDateString()
  @IsOptional()
  dateFrom?: string

  @IsDateString()
  @IsOptional()
  dateTo?: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number
}
