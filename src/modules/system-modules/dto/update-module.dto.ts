import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class UpdateModuleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value !== undefined ? parseInt(String(value), 10) : undefined))
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
