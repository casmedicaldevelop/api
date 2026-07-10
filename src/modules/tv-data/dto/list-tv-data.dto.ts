import { IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ListTvDataDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string
}
