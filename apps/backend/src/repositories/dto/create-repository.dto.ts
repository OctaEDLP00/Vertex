import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateRepositoryDto {
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean
}
