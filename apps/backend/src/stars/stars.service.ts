import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StarsService {
  constructor(private prisma: PrismaService) {}

  private async getRepoId(owner: string, name: string) {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')
    return repo.id
  }

  async star(owner: string, name: string, userId: string) {
    const repositoryId = await this.getRepoId(owner, name)

    const existing = await this.prisma.star.findUnique({
      where: { userId_repositoryId: { userId, repositoryId } },
    })
    if (existing) return { starred: true }

    await this.prisma.star.create({ data: { userId, repositoryId } })
    return { starred: true }
  }

  async unstar(owner: string, name: string, userId: string) {
    const repositoryId = await this.getRepoId(owner, name)

    await this.prisma.star.deleteMany({
      where: { userId, repositoryId },
    })
    return { starred: false }
  }

  async count(owner: string, name: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const count = await this.prisma.star.count({ where: { repositoryId } })
    return { count }
  }

  async isStarred(owner: string, name: string, userId: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const star = await this.prisma.star.findUnique({
      where: { userId_repositoryId: { userId, repositoryId } },
    })
    return { starred: !!star }
  }

  async userStars(userId: string) {
    const stars = await this.prisma.star.findMany({
      where: { userId },
      include: {
        repository: {
          include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return stars.map((s) => s.repository)
  }

  async stargazers(owner: string, name: string) {
    const repositoryId = await this.getRepoId(owner, name)
    return this.prisma.star.findMany({
      where: { repositoryId },
      include: { user: { select: { id: true, username: true, name: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }
}
