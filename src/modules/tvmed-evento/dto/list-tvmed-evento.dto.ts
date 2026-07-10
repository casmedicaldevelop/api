import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ListTvMedEventoDto {
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) page?: number
  @IsOptional() @IsInt() @Min(1) @Type(() => Number) limit?: number

  // Filtros por campo (todos opcionales y combinables).
  @IsOptional() @IsString() cum?: string
  @IsOptional() @IsString() name?: string
  @IsOptional() @IsString() isActive?: string // 'true' | 'false'
  @IsOptional() @IsString() concentration?: string
  @IsOptional() @IsString() presentation?: string
  @IsOptional() @IsString() administrationRoute?: string
  @IsOptional() @IsString() shortName?: string
  @IsOptional() @IsString() pharmaceuticalForm?: string
  @IsOptional() @IsInt() @Type(() => Number) measurementUnit?: number
  @IsOptional() @IsInt() @Type(() => Number) dispensingUnit?: number
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) valueMin?: number
  @IsOptional() @IsInt() @Min(0) @Type(() => Number) valueMax?: number
}
