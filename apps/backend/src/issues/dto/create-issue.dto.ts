import { IsOptional, IsString } from 'class-validator'

export class CreateIssueDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  body?: string
}
