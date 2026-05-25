import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  username: string;

  @IsString()
  @IsNotEmpty()
  identificationNumber: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  moduleIds?: string[];
}
