import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListProductsDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value as string, 10) : undefined))
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value as string, 10) : undefined))
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isActive?: boolean;
}
