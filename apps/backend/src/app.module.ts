import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { HealthController } from './health/health.controller'
import { HealthService } from './health/health.service'
import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { CommitsModule } from './commits/commits.module'
import { GitServerModule } from './git-server/git-server.module'
import { IssuesModule } from './issues/issues.module'
import { PrismaModule } from './prisma/prima.module'
import { PullRequestModule } from './pull-request/pull-request.module'
import { RepositoriesModule } from './repositories/repositories.module'
import { SearchModule } from './search/search.module'
import { StarsModule } from './stars/stars.module'
import { UsersModule } from './users/users.module'
import { WebhooksModule } from './webhooks/webhooks.module'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    RepositoriesModule,
    CommitsModule,
    IssuesModule,
    WebhooksModule,
    AuthModule,
    PullRequestModule,
    GitServerModule,
    StarsModule,
    SearchModule,
    CommentsModule,
  ],
  controllers: [HealthController],
  providers: [HealthService, { provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
