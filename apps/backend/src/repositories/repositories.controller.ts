import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRepositoryDto } from './dto/create-repository.dto'
import { UpdateRepositoryDto } from './dto/update-repository.dto'
import { RepositoriesService } from './repositories.service'

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get()
  findAll(@Query('ownerId') ownerId?: string) {
    return this.repositoriesService.findAll(ownerId)
  }

  @Get(':owner/:name')
  findByOwnerAndName(@Param('owner') owner: string, @Param('name') name: string) {
    return this.repositoriesService.findByOwnerAndName(owner, name)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateRepositoryDto, @Req() req: any) {
    return this.repositoriesService.create(dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':owner/:name')
  update(@Param('owner') owner: string, @Param('name') name: string, @Body() dto: UpdateRepositoryDto, @Req() req: any) {
    return this.repositoriesService.update(owner, name, dto, req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':owner/:name')
  remove(@Param('owner') owner: string, @Param('name') name: string, @Req() req: any) {
    return this.repositoriesService.remove(owner, name, req.user.id)
  }
}
