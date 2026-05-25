import { Module } from '@nestjs/common'

import { GitServerController } from './git-server.controller'
import { GitServerService } from './git-server.service'

@Module({
  controllers: [GitServerController],
  providers: [GitServerService],
})
export class GitServerModule {}
