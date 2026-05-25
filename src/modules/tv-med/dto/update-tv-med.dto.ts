import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

export class UpdateTvMedDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string
}
