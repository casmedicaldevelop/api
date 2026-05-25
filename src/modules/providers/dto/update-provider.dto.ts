import { IsOptional, IsString } from 'class-validator';

export class UpdateProviderDto {
  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
