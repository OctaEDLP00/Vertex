import { Injectable } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string, type?: string) {
    const results: any = {}

    if (!type || type === 'repositories') {
      results.repositories = await this.prisma.repository.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        },
        include: { owner: { select: { id: true, username: true, name: true, lastName: true } } },
        take: 20,
      })
    }

    if (!type || type === 'issues') {
      results.issues = await this.prisma.issue.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { body: { contains: q } },
          ],
        },
        include: {
          author: { select: { id: true, username: true, name: true, lastName: true } },
          repository: { select: { name: true, owner: { select: { username: true } } } },
        },
        take: 20,
      })
    }

    if (!type || type === 'pullRequests') {
      results.pullRequests = await this.prisma.pullRequest.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { body: { contains: q } },
          ],
        },
        include: {
          author: { select: { id: true, username: true, name: true, lastName: true } },
          repository: { select: { name: true, owner: { select: { username: true } } } },
        },
        take: 20,
      })
    }

    if (!type || type === 'users') {
      results.users = await this.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: q } },
            { name: { contains: q } },
            { lastName: { contains: q } },
          ],
        },
        select: { id: true, username: true, name: true, lastName: true, email: true, role: true },
        take: 20,
      })
    }

    return results
  }
}
