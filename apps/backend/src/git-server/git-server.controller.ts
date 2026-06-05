import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import type { FastifyReply } from 'fastify'

import { GitServerService } from './git-server.service'

@Controller()
export class GitServerController {
  constructor(private readonly gitServerService: GitServerService) {}

  @Get(':owner/:repo.git/info/refs')
  async infoRefs(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('service') service: string,
    @Res() res: FastifyReply,
  ) {
    const localPath = await this.gitServerService.getRepoPath(owner, repo)

    if (service !== 'git-upload-pack' && service !== 'git-receive-pack') {
      return res.status(400).send({ error: 'Invalid service' })
    }

    const body = await this.gitServerService.handleInfoRefs(localPath, service)

    res.header('Content-Type', `application/x-${service}-advertisement`)
    res.header('Cache-Control', 'no-cache')
    res.send(body)
  }

  @Post(':owner/:repo.git/git-upload-pack')
  async uploadPack(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Body() body: any,
    @Headers('content-type') contentType: string,
    @Res() res: FastifyReply,
  ) {
    const localPath = await this.gitServerService.getRepoPath(owner, repo)
    const rawData = typeof body === 'object' ? Buffer.from(JSON.stringify(body)) : Buffer.from(body ?? '')
    const result = await this.gitServerService.handleUploadPack(localPath, rawData)

    res.header('Content-Type', 'application/x-git-upload-pack-result')
    res.send(result)
  }

  @Post(':owner/:repo.git/git-receive-pack')
  async receivePack(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Body() body: any,
    @Res() res: FastifyReply,
  ) {
    const localPath = await this.gitServerService.getRepoPath(owner, repo)
    const rawData = typeof body === 'object' ? Buffer.from(JSON.stringify(body)) : Buffer.from(body ?? '')
    const result = await this.gitServerService.handleReceivePack(localPath, rawData)

    res.header('Content-Type', 'application/x-git-receive-pack-result')
    res.send(result)
  }
}
