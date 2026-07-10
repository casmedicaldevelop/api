import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTvInsEventoDto {
  @IsString()
  @IsNotEmpty()
  cum: string

  @IsString()
  @IsNotEmpty()
  name: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  value: number

  @IsString()
  @IsNotEmpty()
  concentration: string

  @IsString()
  @IsNotEmpty()
  presentation: string

  @IsString()
  @IsNotEmpty()
  administrationRoute: string

  @IsString()
  @IsNotEmpty()
  shortName: string

  @Type(() => Number)
  @IsInt()
  measurementUnit: number

  @IsString()
  @IsNotEmpty()
  pharmaceuticalForm: string

  @Type(() => Number)
  @IsInt()
  dispensingUnit: number
}
