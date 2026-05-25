import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

export enum RegisterRole {
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @IsString()
  name!: string

  @IsString()
  lastName!: string

  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6)
  password!: string

  @IsEnum(RegisterRole)
  role!: RegisterRole

  @IsOptional()
  @IsString()
  institutionId?: string
}
