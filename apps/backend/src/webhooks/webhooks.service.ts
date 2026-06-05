import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateWebhookDto } from './dto/create-webhook.dto'
import { UpdateWebhookDto } from './dto/update-webhook.dto'

@Injectable()
export class WebhooksService {
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

  async findAll(owner: string, name: string) {
    const repositoryId = await this.getRepoId(owner, name)
    return this.prisma.webhook.findMany({ where: { repositoryId }, orderBy: { createdAt: 'desc' } })
  }

  async create(owner: string, name: string, dto: CreateWebhookDto) {
    const repositoryId = await this.getRepoId(owner, name)
    return this.prisma.webhook.create({
      data: {
        url: dto.url,
        secret: dto.secret,
        events: dto.events.join(','),
        isActive: dto.isActive ?? true,
        repositoryId,
      },
    })
  }

  async update(owner: string, name: string, id: string, dto: UpdateWebhookDto) {
    const repositoryId = await this.getRepoId(owner, name)
    const existing = await this.prisma.webhook.findFirst({ where: { id, repositoryId } })
    if (!existing) throw new NotFoundException('Webhook not found')

    const data: any = {}
    if (dto.url !== undefined) data.url = dto.url
    if (dto.secret !== undefined) data.secret = dto.secret
    if (dto.events !== undefined) data.events = dto.events.join(',')
    if (dto.isActive !== undefined) data.isActive = dto.isActive

    return this.prisma.webhook.update({ where: { id }, data })
  }

  async remove(owner: string, name: string, id: string) {
    const repositoryId = await this.getRepoId(owner, name)
    const existing = await this.prisma.webhook.findFirst({ where: { id, repositoryId } })
    if (!existing) throw new NotFoundException('Webhook not found')

    await this.prisma.webhook.delete({ where: { id } })
    return { success: true }
  }
}
