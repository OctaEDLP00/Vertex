import { IsOptional, IsString } from 'class-validator'

export class CommitQueryDto {
  @IsOptional()
  @IsString()
  ref?: string
}
