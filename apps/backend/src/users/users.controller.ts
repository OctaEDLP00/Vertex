import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(@Req() req: any, @Body() body: { name?: string; lastName?: string; username?: string }) {
    return this.usersService.updateProfile(req.user.id, body)
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username)
  }
}
