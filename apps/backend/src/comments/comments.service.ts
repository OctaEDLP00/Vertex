import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createOnIssue(owner: string, name: string, issueNumber: number, dto: CreateCommentDto, userId: string) {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')

    const issue = await this.prisma.issue.findUnique({
      where: { repositoryId_number: { repositoryId: repo.id, number: issueNumber } },
    })
    if (!issue) throw new NotFoundException('Issue not found')

    return this.prisma.comment.create({
      data: { body: dto.body, authorId: userId, issueId: issue.id },
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }

  async createOnPullRequest(owner: string, name: string, prNumber: number, dto: CreateCommentDto, userId: string) {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')

    const pr = await this.prisma.pullRequest.findUnique({
      where: { repositoryId_number: { repositoryId: repo.id, number: prNumber } },
    })
    if (!pr) throw new NotFoundException('Pull request not found')

    return this.prisma.comment.create({
      data: { body: dto.body, authorId: userId, pullRequestId: pr.id },
      include: { author: { select: { id: true, username: true, name: true, lastName: true } } },
    })
  }
}
