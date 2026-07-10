import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

// Una línea (medicamento/insumo) de la radicación.
export class CreateFilingEventItemDto {
  @IsString() @IsNotEmpty() cum: string
  @IsString() @IsNotEmpty() name: string
  @IsString() @IsNotEmpty() serviceType: string // MEDICAMENTO | INSUMO

  @IsInt() @Min(0) quantity: number
  @IsInt() @Min(0) unitValue: number

  @IsString() concentration: string
  @IsString() presentation: string
  @IsString() administrationRoute: string
  @IsString() shortName: string
  @IsInt() measurementUnit: number
  @IsString() pharmaceuticalForm: string
  @IsInt() dispensingUnit: number

  @IsInt() @Min(1) frequencyPerDay: number
  @IsInt() @Min(1) treatmentDuration: number
  @IsInt() @Min(1) prescribedQuantity: number
  @IsInt() @Min(1) treatmentDays: number
}

// Cabecera + lista de líneas que envía el wizard de radicación de evento. El backend deriva por línea:
// totalValue (unitValue*quantity), diagnosisDetail (tabla diagnoses), status/quantityPending iniciales;
// y en la cabecera: userType (del usuario), contractId (contrato EN CURSO), status general inicial.
export class CreateFilingEventDto {
  @IsString() @IsNotEmpty() authorizationCode: string
  @IsString() senderCode: string // IPS remitente: código
  @IsString() senderName: string // IPS remitente: nombre
  @IsString() @IsNotEmpty() doctorDocument: string
  @IsString() @IsNotEmpty() userDocument: string

  @IsDateString() prescriptionDate: string
  @IsDateString() authorizationDate: string
  @IsDateString() requestDate: string

  @IsString() @IsNotEmpty() mainDiagnosis: string // diagnóstico global de la radicación

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFilingEventItemDto)
  items: CreateFilingEventItemDto[]
}
