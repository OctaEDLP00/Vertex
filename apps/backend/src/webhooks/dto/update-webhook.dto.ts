import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateWebhookDto {
  @IsOptional()
  @IsString()
  url?: string

  @IsOptional()
  @IsString()
  secret?: string

  @IsOptional()
  @IsArray()
  events?: string[]

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
