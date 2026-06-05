import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('repositories/:owner/:name/issues/:number/comments')
  createOnIssue(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('number') number: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.createOnIssue(owner, name, +number, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('repositories/:owner/:name/pulls/:number/comments')
  createOnPullRequest(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('number') number: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.commentsService.createOnPullRequest(owner, name, +number, dto, req.user.id)
  }
}
