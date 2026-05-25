import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListProviderProductsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
