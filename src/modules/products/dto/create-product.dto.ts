import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsOptional()
  cum?: string | null;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  box: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  unit: number;

  @IsString()
  @IsNotEmpty()
  lot: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  warehouse: number;
}
