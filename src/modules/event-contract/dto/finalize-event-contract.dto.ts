import { Matches } from 'class-validator'

export class FinalizeEventContractDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'closeDate debe tener formato YYYY-MM-DD' })
  closeDate: string
}
