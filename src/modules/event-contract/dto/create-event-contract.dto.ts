import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class CreateEventContractDto {
  // Número del contrato: alfanumérico, obligatorio y único.
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'contractNumber es obligatorio' })
  @MaxLength(50)
  contractNumber: string

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'startDate debe tener formato YYYY-MM-DD' })
  startDate: string

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'endDate debe tener formato YYYY-MM-DD' })
  endDate: string

  @IsInt() @Min(0) @Type(() => Number) contributoryValue: number
  @IsInt() @Min(0) @Type(() => Number) subsidizedValue: number
}
