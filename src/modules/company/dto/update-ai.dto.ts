import { IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateAiDto {
  @IsOptional()
  @IsString()
  aiApiKey?: string

  @IsString()
  @MinLength(1)
  aiModel: string
}
