import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { StarsService } from './stars.service'

@Controller()
export class StarsController {
  constructor(private readonly starsService: StarsService) {}

  @Get('repositories/:owner/:name/stargazers')
  stargazers(@Param('owner') owner: string, @Param('name') name: string) {
    return this.starsService.stargazers(owner, name)
  }

  @Get('repositories/:owner/:name/star')
  async checkStar(@Param('owner') owner: string, @Param('name') name: string, @Req() req: any) {
    if (!req.user) return { starred: false }
    return this.starsService.isStarred(owner, name, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('repositories/:owner/:name/star')
  star(@Param('owner') owner: string, @Param('name') name: string, @Req() req: any) {
    return this.starsService.star(owner, name, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('repositories/:owner/:name/star')
  unstar(@Param('owner') owner: string, @Param('name') name: string, @Req() req: any) {
    return this.starsService.unstar(owner, name, req.user.id)
  }

  @Get('repositories/:owner/:name/stars')
  count(@Param('owner') owner: string, @Param('name') name: string) {
    return this.starsService.count(owner, name)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/stars')
  userStars(@Req() req: any) {
    return this.starsService.userStars(req.user.id)
  }
}
