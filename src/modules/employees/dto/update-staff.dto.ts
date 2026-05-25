import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateStaffDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  identificationNumber?: string;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
