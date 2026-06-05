import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreatePullRequestDto } from './dto/create-pull-request.dto'
import { UpdatePullRequestDto } from './dto/update-pull-request.dto'
import { PullRequestService } from './pull-request.service'

@Controller('repositories/:owner/:name/pulls')
export class PullRequestController {
  constructor(private readonly pullRequestService: PullRequestService) {}

  @Get()
  findAll(@Param('owner') owner: string, @Param('name') name: string, @Query('status') status?: string) {
    return this.pullRequestService.findAll(owner, name, status)
  }

  @Get(':number')
  findOne(@Param('owner') owner: string, @Param('name') name: string, @Param('number') number: string) {
    return this.pullRequestService.findOne(owner, name, +number)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Body() dto: CreatePullRequestDto,
    @Req() req: any,
  ) {
    return this.pullRequestService.create(owner, name, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':number')
  update(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('number') number: string,
    @Body() dto: UpdatePullRequestDto,
  ) {
    return this.pullRequestService.update(owner, name, +number, dto)
  }
}
