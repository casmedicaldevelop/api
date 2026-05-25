import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProviderProductDto {
  @IsOptional()
  @IsString()
  product?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  iva?: boolean;

  @IsOptional()
  @IsString()
  cum?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceBox?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceUnit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stopBox?: number;
}
