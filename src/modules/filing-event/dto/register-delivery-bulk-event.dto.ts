import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator'

export class BulkDeliveryLineDto {
  @IsInt()
  itemId!: number

  @IsIn(['COMPLETA', 'PARCIAL', 'SIN_EXISTENCIAS'])
  deliveryType!: 'COMPLETA' | 'PARCIAL' | 'SIN_EXISTENCIAS'

  // Requerido solo en PARCIAL (1..pendiente-1). En COMPLETA se toma el pendiente; en SIN_EXISTENCIAS es 0.
  @IsInt()
  @Min(0)
  @IsOptional()
  quantity?: number

  @IsString()
  @IsOptional()
  comment?: string
}

/** Entrega de TODAS las líneas seleccionadas de una radicación en un mismo proceso. */
export class RegisterDeliveryBulkEventDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BulkDeliveryLineDto)
  lines!: BulkDeliveryLineDto[]
}
