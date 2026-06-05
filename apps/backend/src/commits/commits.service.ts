import { Injectable, NotFoundException } from '@nestjs/common'
import { execSync } from 'child_process'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class CommitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(owner: string, name: string, ref = 'HEAD') {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')

    try {
      const output = execSync(
        `git log --oneline --abbrev-commit --format="%H||%an||%ae||%at||%s" ${ref} -50`,
        { cwd: repo.localPath, encoding: 'utf-8' },
      )

      return output
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line: string) => {
          const [hash, author, email, timestamp, ...messageParts] = line.split('||')
          return {
            hash,
            author,
            email,
            date: new Date(+timestamp * 1000).toISOString(),
            message: messageParts.join('||'),
          }
        })
    } catch {
      return []
    }
  }

  async findOne(owner: string, name: string, sha: string) {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')

    try {
      const output = execSync(
        `git show --format="%H||%an||%ae||%at||%s||%b" --no-patch ${sha}`,
        { cwd: repo.localPath, encoding: 'utf-8' },
      )

      const [hash, author, email, timestamp, subject, ...bodyParts] = output.trim().split('||')

      const files = execSync(
        `git diff-tree --no-commit-id -r --name-status ${sha}`,
        { cwd: repo.localPath, encoding: 'utf-8' },
      )
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((line: string) => {
          const [status, ...fileParts] = line.split('\t')
          return { status, file: fileParts.join('\t') }
        })

      return {
        hash,
        author,
        email,
        date: new Date(+timestamp * 1000).toISOString(),
        subject,
        body: bodyParts.join('||').trim(),
        files,
      }
    } catch {
      throw new NotFoundException('Commit not found')
    }
  }
}
