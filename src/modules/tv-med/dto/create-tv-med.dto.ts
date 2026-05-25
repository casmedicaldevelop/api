import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTvMedDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string
}
