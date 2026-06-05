import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateIssueDto } from './dto/create-issue.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'

@Injectable()
export class IssuesService {
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
    const last = await this.prisma.issue.findFirst({
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

    return this.prisma.issue.findMany({
      where,
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(owner: string, name: string, number: number) {
    const repositoryId = await this.getRepoId(owner, name)
    const issue = await this.prisma.issue.findUnique({
      where: { repositoryId_number: { repositoryId, number } },
      include: {
        author: { select: { id: true, username: true, name: true, lastName: true } },
        comments: {
          include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    if (!issue) throw new NotFoundException('Issue not found')
    return issue
  }

  async create(owner: string, name: string, dto: CreateIssueDto, userId: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const number = await this.getNextNumber(repositoryId)

    return this.prisma.issue.create({
      data: {
        number,
        title: dto.title,
        body: dto.body,
        repositoryId,
        authorId: userId,
      },
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }

  async update(owner: string, name: string, number: number, dto: UpdateIssueDto) {
    const repositoryId = await this.getRepoId(owner, name)
    const existing = await this.prisma.issue.findUnique({
      where: { repositoryId_number: { repositoryId, number } },
    })
    if (!existing) throw new NotFoundException('Issue not found')

    return this.prisma.issue.update({
      where: { id: existing.id },
      data: dto,
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }
}
