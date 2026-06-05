import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, name: true, lastName: true, email: true, role: true, createdAt: true },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, name: true, lastName: true, email: true, role: true, createdAt: true },
    })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async updateProfile(id: string, data: { name?: string; lastName?: string; username?: string }) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, name: true, lastName: true, email: true, role: true, createdAt: true },
    })
    return user
  }
}
