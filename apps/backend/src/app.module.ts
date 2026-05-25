import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CommitsModule } from './commits/commits.module'
import { GitServerModule } from './git-server/git-server.module'
import { IssuesModule } from './issues/issues.module'
import { PullRequestModule } from './pull-request/pull-request.module'
import { RepositoriesModule } from './repositories/repositories.module'
import { UsersModule } from './users/users.module'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
  imports: [
    UsersModule,
    RepositoriesModule,
    CommitsModule,
    IssuesModule,
    WebhooksModule,
    AuthModule,
    PullRequestModule,
    GitServerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
