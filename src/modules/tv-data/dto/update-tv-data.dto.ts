import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateTvDataDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsOptional()
  inventoryCode?: string | null

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number
}
