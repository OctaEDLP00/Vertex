import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto) {}

  async register(registerDto: RegisterDto) {}

  async refresh(refreshToken: string) {}

  async validateUser(userId: string) {}
}
