import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class SetRadicadoEventDto {
  @IsString()
  @IsNotEmpty({ message: 'El código de radicado es requerido' })
  @MaxLength(50)
  filingCode: string
}
