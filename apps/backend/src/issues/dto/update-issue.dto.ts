import { IsOptional, IsString } from 'class-validator'

export class UpdateIssueDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  body?: string

  @IsOptional()
  @IsString()
  status?: 'OPEN' | 'CLOSED'
}
