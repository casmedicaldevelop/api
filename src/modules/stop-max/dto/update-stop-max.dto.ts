import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStopMaxDto {
  @IsString()
  @IsOptional()
  product?: string;

  @IsString()
  @IsOptional()
  cum?: string | null;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  price?: number;
}
