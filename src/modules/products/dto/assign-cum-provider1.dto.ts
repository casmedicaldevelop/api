import { IsNotEmpty, IsString } from 'class-validator';

export class AssignCumProvider1Dto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  cum: string;
}
