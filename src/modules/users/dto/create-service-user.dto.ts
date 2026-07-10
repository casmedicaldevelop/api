import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { DocumentType, Gender, HealthcareRegime } from '@prisma/client';

// All user-supplied strings are normalized to uppercase + trimmed.
// Domain rule: every patient/user data point persists as uppercase.
const toUpper = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

export class CreateServiceUserDto {
  @Transform(toUpper)
  @IsString()
  @IsNotEmpty({ message: 'La cédula es requerida' })
  @Matches(/^\d+$/, { message: 'La cédula solo debe contener dígitos' })
  @MaxLength(20, { message: 'La cédula no puede superar 20 dígitos' })
  id: string;

  @IsOptional()
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  documentType?: DocumentType;

  @IsOptional()
  @IsEnum(Gender, { message: 'Género inválido' })
  gender?: Gender;

  @Transform(toUpper)
  @IsString()
  @IsNotEmpty({ message: 'El primer nombre es requerido' })
  @MaxLength(100)
  firstName: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondName?: string;

  @Transform(toUpper)
  @IsString()
  @IsNotEmpty({ message: 'El primer apellido es requerido' })
  @MaxLength(100)
  firstSurname: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondSurname?: string;

  @Transform(toUpper)
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  phone: string;

  @Transform(toUpper)
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  birthDate?: string;

  @IsOptional()
  @IsBoolean()
  birthDateApproximate?: boolean;

  @IsOptional()
  @IsEnum(HealthcareRegime, { message: 'Régimen de salud inválido' })
  healthcareRegime?: HealthcareRegime;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
