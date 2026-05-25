import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ListTvMedDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string
}
