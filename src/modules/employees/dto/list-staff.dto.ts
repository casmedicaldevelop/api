import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Role } from '@prisma/client';

export class ListStaffDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number = 20;

  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;
}
