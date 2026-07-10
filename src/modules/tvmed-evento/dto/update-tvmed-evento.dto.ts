import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateTvMedEventoDto {
  @IsString() @IsNotEmpty() @IsOptional() cum?: string
  @IsString() @IsNotEmpty() @IsOptional() name?: string
  @Type(() => Number) @IsInt() @Min(0) @IsOptional() value?: number
  @IsString() @IsNotEmpty() @IsOptional() concentration?: string
  @IsString() @IsNotEmpty() @IsOptional() presentation?: string
  @IsString() @IsNotEmpty() @IsOptional() administrationRoute?: string
  @IsString() @IsNotEmpty() @IsOptional() shortName?: string
  @Type(() => Number) @IsInt() @IsOptional() measurementUnit?: number
  @IsString() @IsNotEmpty() @IsOptional() pharmaceuticalForm?: string
  @Type(() => Number) @IsInt() @IsOptional() dispensingUnit?: number
}
