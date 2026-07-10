import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateScheduleDto {
  // ── SISPRO Programacion (Tx -3-) ──────────────────────────────────────────
  // ID del direccionamiento SISPRO amarrado; también se persiste en filing_mipres.routing_id.
  @IsString()
  @IsNotEmpty()
  miPresDireccionId!: string

  @IsString()
  @IsNotEmpty()
  fecMaxEnt!: string

  @IsString()
  @MaxLength(2)
  tipoIdSedeProv!: string

  @IsString()
  @MaxLength(10)
  noIdSedeProv!: string

  @IsString()
  @MaxLength(20)
  codSedeProv!: string

  @IsString()
  @MaxLength(20)
  codSerTecAEntregar!: string

  @IsString()
  @MaxLength(20)
  cantTotAEntregar!: string

  // ── Radicado (persistencia local tras respuesta correcta) ─────────────────
  @IsString()
  @IsNotEmpty()
  doctorDocument!: string

  @IsString()
  @IsNotEmpty()
  userDocument!: string

  @IsString()
  @IsNotEmpty()
  prescriptionNumber!: string

  @IsString()
  @IsNotEmpty()
  medicationName!: string

  @IsOptional()
  @IsString()
  inventoryCode?: string | null

  @IsInt()
  @Min(0)
  unitPrice!: number
}
