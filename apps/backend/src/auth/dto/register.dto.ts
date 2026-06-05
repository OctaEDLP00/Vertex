import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator'

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
}
