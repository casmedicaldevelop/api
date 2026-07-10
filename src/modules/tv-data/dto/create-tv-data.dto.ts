import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateTvDataDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  inventoryCode?: string

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number
}
