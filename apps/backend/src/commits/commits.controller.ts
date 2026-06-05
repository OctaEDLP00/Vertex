import { Controller, Get, Param, Query } from '@nestjs/common'

import { CommitsService } from './commits.service'

@Controller('repositories/:owner/:name/commits')
export class CommitsController {
  constructor(private readonly commitsService: CommitsService) {}

  @Get()
  findAll(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Query('ref') ref?: string,
  ) {
    return this.commitsService.findAll(owner, name, ref)
  }

  @Get(':sha')
  findOne(@Param('owner') owner: string, @Param('name') name: string, @Param('sha') sha: string) {
    return this.commitsService.findOne(owner, name, sha)
  }
}
