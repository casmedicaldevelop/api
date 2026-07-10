import { IsInt, IsOptional, Min } from 'class-validator'

export class UpdatePrescriptionEventDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  frequencyPerDay?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  treatmentDuration?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  prescribedQuantity?: number

  @IsOptional()
  @IsInt()
  @Min(0)
  treatmentDays?: number
}
