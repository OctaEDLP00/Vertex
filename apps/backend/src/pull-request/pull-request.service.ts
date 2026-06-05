import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreatePullRequestDto } from './dto/create-pull-request.dto'
import { UpdatePullRequestDto } from './dto/update-pull-request.dto'

@Injectable()
export class PullRequestService {
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

  private async getNextNumber(repositoryId: string) {
    const last = await this.prisma.pullRequest.findFirst({
      where: { repositoryId },
      orderBy: { number: 'desc' },
      select: { number: true },
    })
    return (last?.number ?? 0) + 1
  }

  async findAll(owner: string, name: string, status?: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const where: any = { repositoryId }
    if (status) where.status = status

    return this.prisma.pullRequest.findMany({
      where,
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(owner: string, name: string, number: number) {
    const repositoryId = await this.getRepoId(owner, name)
    const pr = await this.prisma.pullRequest.findUnique({
      where: { repositoryId_number: { repositoryId, number } },
      include: {
        author: { select: { id: true, username: true, name: true, lastName: true } },
        comments: {
          include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    if (!pr) throw new NotFoundException('Pull request not found')
    return pr
  }

  async create(owner: string, name: string, dto: CreatePullRequestDto, userId: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const number = await this.getNextNumber(repositoryId)

    return this.prisma.pullRequest.create({
      data: {
        number,
        title: dto.title,
        body: dto.body,
        sourceBranch: dto.sourceBranch,
        targetBranch: dto.targetBranch,
        repositoryId,
        authorId: userId,
      },
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }

  async update(owner: string, name: string, number: number, dto: UpdatePullRequestDto) {
    const repositoryId = await this.getRepoId(owner, name)
    const existing = await this.prisma.pullRequest.findUnique({
      where: { repositoryId_number: { repositoryId, number } },
    })
    if (!existing) throw new NotFoundException('Pull request not found')

    return this.prisma.pullRequest.update({
      where: { id: existing.id },
      data: dto,
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }
}
