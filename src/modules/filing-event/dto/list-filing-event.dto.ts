import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ListFilingEventDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number

  @IsOptional() @IsString() status?: string
  @IsOptional() @IsString() userDocument?: string
  // Nombre del usuario: vive en `users`, no en filing_event. Se resuelve por documento.
  @IsOptional() @IsString() userName?: string
  // Régimen: la foto guardada en filing_event.user_type al momento de radicar.
  @IsOptional() @IsIn(['CONTRIBUTIVO', 'SUBSIDIADO']) userType?: string
  @IsOptional() @IsString() authorizationCode?: string
  @IsOptional() @IsString() cum?: string
  @IsOptional() @IsString() dateExact?: string // YYYY-MM-DD
  @IsOptional() @IsString() dateFrom?: string
  @IsOptional() @IsString() dateTo?: string
}
