import { Injectable, NotFoundException } from '@nestjs/common'
import { execSync, spawn } from 'child_process'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class GitServerService {
  constructor(private prisma: PrismaService) {}

  async getRepoPath(owner: string, name: string): Promise<string> {
    const ownerUser = await this.prisma.user.findUnique({ where: { username: owner } })
    if (!ownerUser) throw new NotFoundException('Owner not found')

    const repo = await this.prisma.repository.findUnique({
      where: { ownerId_name: { ownerId: ownerUser.id, name } },
    })
    if (!repo) throw new NotFoundException('Repository not found')

    return repo.localPath
  }

  async initRepo(localPath: string) {
    execSync(`git init --bare "${localPath}"`, { encoding: 'utf-8' })
  }

  async handleInfoRefs(localPath: string, service: string) {
    try {
      const output = execSync(`git ${service} --advertise-refs "${localPath}"`, {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
      })

      const packet = this.createPacket('# service=' + service + '\n')
      const flush = '0000'
      return packet + flush + output
    } catch {
      throw new NotFoundException('Git repository error')
    }
  }

  async handleUploadPack(localPath: string, body: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      const child = spawn('git', ['upload-pack', '--stateless-rpc', localPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      const chunks: Buffer[] = []
      child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
      child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk))
      child.on('close', (code: number) => {
        if (code === 0) resolve(Buffer.concat(chunks))
        else reject(new Error('git upload-pack failed'))
      })
      child.on('error', reject)
      child.stdin.end(body)
    })
  }

  async handleReceivePack(localPath: string, body: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      const child = spawn('git', ['receive-pack', '--stateless-rpc', localPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      const chunks: Buffer[] = []
      child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
      child.stderr.on('data', (chunk: Buffer) => chunks.push(chunk))
      child.on('close', (code: number) => {
        if (code === 0) resolve(Buffer.concat(chunks))
        else reject(new Error('git receive-pack failed'))
      })
      child.on('error', reject)
      child.stdin.end(body)
    })
  }

  private createPacket(str: string): string {
    const len = (str.length + 4).toString(16).padStart(4, '0')
    return len + str
  }
}
