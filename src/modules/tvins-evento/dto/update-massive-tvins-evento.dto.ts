import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class ApplyUpdateItem {
  @IsInt() @Type(() => Number) id: number
  @IsInt() @Min(0) @Type(() => Number) value: number
}

export class ApplyUpdateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplyUpdateItem)
  items: ApplyUpdateItem[]
}

class MissingRow {
  @IsString() cum: string
  @IsOptional() @IsString() name: string
  @IsInt() @Type(() => Number) value: number
}

export class MissingTemplateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MissingRow)
  rows: MissingRow[]
}
