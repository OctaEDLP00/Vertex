import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateIssueDto } from './dto/create-issue.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'
import { IssuesService } from './issues.service'

@Controller('repositories/:owner/:name/issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  findAll(@Param('owner') owner: string, @Param('name') name: string, @Query('status') status?: string) {
    return this.issuesService.findAll(owner, name, status)
  }

  @Get(':number')
  findOne(@Param('owner') owner: string, @Param('name') name: string, @Param('number') number: string) {
    return this.issuesService.findOne(owner, name, +number)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Param('owner') owner: string, @Param('name') name: string, @Body() dto: CreateIssueDto, @Req() req: any) {
    return this.issuesService.create(owner, name, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':number')
  update(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('number') number: string,
    @Body() dto: UpdateIssueDto,
  ) {
    return this.issuesService.update(owner, name, +number, dto)
  }
}
