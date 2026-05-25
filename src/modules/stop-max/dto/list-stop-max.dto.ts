import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListStopMaxDto {
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
}
