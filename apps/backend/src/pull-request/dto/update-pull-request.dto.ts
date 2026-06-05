import { IsOptional, IsString } from 'class-validator'

export class UpdatePullRequestDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  body?: string

  @IsOptional()
  @IsString()
  status?: 'OPEN' | 'MERGED' | 'CLOSED'
}
