import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
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
  box?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  unit?: number;

  @IsString()
  @IsOptional()
  lot?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  warehouse?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
