import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStopMaxDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsOptional()
  cum?: string | null;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  price: number;
}
