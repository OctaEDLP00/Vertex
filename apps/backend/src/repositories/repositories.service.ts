import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'

import { PrismaService } from '../prisma/prisma.service'
import { CreateRepositoryDto } from './dto/create-repository.dto'
import { UpdateRepositoryDto } from './dto/update-repository.dto'

@Injectable()
export class RepositoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(ownerId?: string) {
    const where = ownerId ? { ownerId } : {}
    return this.prisma.repository.findMany({
      where: { ...where, isPrivate: ownerId ? undefined : false },
      include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByOwnerAndName(owner: string, name: string) {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
      include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
    })
    if (!repo) throw new NotFoundException('Repository not found')
    return repo
  }

  async create(dto: CreateRepositoryDto, userId: string) {
    const existing = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: userId, name: dto.name } },
    })
    if (existing) throw new ConflictException('Repository already exists')

    const localPath = path.join(process.cwd(), 'git-storage', userId, `${dto.name}.git`)

    const repo = await this.prisma.repository.create({
      data: {
        name: dto.name,
        description: dto.description,
        isPrivate: dto.isPrivate ?? false,
        localPath,
        ownerId: userId,
      },
      include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
    })

    fs.mkdirSync(localPath, { recursive: true })

    return repo
  }

  async update(owner: string, name: string, dto: UpdateRepositoryDto, userId: string) {
    const repo = await this.findByOwnerAndName(owner, name)
    if (repo.ownerId !== userId) throw new ConflictException('Not authorized')

    return this.prisma.repository.update({
      where: { id: repo.id },
      data: dto,
      include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }

  async remove(owner: string, name: string, userId: string) {
    const repo = await this.findByOwnerAndName(owner, name)
    if (repo.ownerId !== userId) throw new ConflictException('Not authorized')

    await this.prisma.repository.delete({ where: { id: repo.id } })
    fs.rmSync(repo.localPath, { recursive: true, force: true })

    return { success: true }
  }
}
