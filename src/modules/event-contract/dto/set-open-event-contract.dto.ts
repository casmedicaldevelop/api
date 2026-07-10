import { IsBoolean } from 'class-validator'

export class SetOpenEventContractDto {
  @IsBoolean()
  isOpen: boolean
}
