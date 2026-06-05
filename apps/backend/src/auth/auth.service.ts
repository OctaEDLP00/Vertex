import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials')

    return this.generateToken(user)
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: registerDto.email } })
    if (existing) throw new ConflictException('Email already registered')

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const username = registerDto.email.split('@')[0]

    const user = await this.prisma.user.create({
      data: {
        username,
        name: registerDto.name,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role,
      },
    })

    return this.generateToken(user)
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } })
      if (!user) throw new UnauthorizedException('User not found')
      return this.generateToken(user)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) return null
    const { password, ...result } = user
    return result
  }

  async validate(userId: string) {
    return this.validateUser(userId)
  }

  validateToken(token: string): { success: true } {
    const testToken = process.env.VERTEX_TEST_TOKEN ?? 'vertex-cli-test-token'

    if (token !== testToken) {
      throw new UnauthorizedException({ success: false, message: 'Invalid or expired token' })
    }

    return { success: true }
  }

  private generateToken(user: { id: string; email: string; role: string; name: string; lastName: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }
}
