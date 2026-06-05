import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateWebhookDto {
  @IsString()
  url!: string

  @IsOptional()
  @IsString()
  secret?: string

  @IsArray()
  events!: string[]

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
