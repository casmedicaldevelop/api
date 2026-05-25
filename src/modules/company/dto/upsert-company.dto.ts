import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpsertCompanyDto {
  @IsString()
  @MinLength(1)
  name: string

  @IsString()
  @MinLength(1)
  nit: string

  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  address?: string
}
