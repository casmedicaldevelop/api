import { IsOptional, IsString } from 'class-validator'

export class UpdateMipresDto {
  @IsOptional()
  @IsString()
  tokenCompany?: string
}
