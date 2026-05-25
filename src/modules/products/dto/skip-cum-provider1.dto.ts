import { IsNotEmpty, IsString } from 'class-validator';

export class SkipCumProvider1Dto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
