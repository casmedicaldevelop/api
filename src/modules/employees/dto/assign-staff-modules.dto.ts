import { IsArray, IsString } from 'class-validator';

export class AssignStaffModulesDto {
  @IsArray()
  @IsString({ each: true })
  moduleIds: string[];
}
