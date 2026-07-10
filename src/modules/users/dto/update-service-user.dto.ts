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

const toUpper = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

// For nullable fields: empty string → null, non-empty → uppercase + trimmed.
const toUpperOrNull = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed.toUpperCase();
};

export class UpdateServiceUserDto {
  @IsOptional()
  @IsEnum(DocumentType, { message: 'Tipo de documento inválido' })
  documentType?: DocumentType;

  @IsOptional()
  @IsEnum(Gender, { message: 'Género inválido' })
  gender?: Gender;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName?: string;

  @Transform(toUpperOrNull)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondName?: string | null;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstSurname?: string;

  @Transform(toUpperOrNull)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondSurname?: string | null;

  @Transform(toUpper)
  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  phone?: string;

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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
