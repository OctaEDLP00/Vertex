import { IsOptional, IsString } from 'class-validator'

export class CreatePullRequestDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  body?: string

  @IsString()
  sourceBranch!: string

  @IsString()
  targetBranch!: string
}
