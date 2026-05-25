import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, { message: 'name solo puede contener letras minúsculas, números y guiones' })
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }: { value: string }) => (value !== undefined ? parseInt(String(value), 10) : undefined))
  displayOrder?: number;
}
