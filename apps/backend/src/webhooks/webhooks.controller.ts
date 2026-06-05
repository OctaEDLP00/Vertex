import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateWebhookDto } from './dto/create-webhook.dto'
import { UpdateWebhookDto } from './dto/update-webhook.dto'
import { WebhooksService } from './webhooks.service'

@Controller('repositories/:owner/:name/webhooks')
@UseGuards(JwtAuthGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  findAll(@Param('owner') owner: string, @Param('name') name: string) {
    return this.webhooksService.findAll(owner, name)
  }

  @Post()
  create(@Param('owner') owner: string, @Param('name') name: string, @Body() dto: CreateWebhookDto) {
    return this.webhooksService.create(owner, name, dto)
  }

  @Patch(':id')
  update(
    @Param('owner') owner: string,
    @Param('name') name: string,
    @Param('id') id: string,
    @Body() dto: UpdateWebhookDto,
  ) {
    return this.webhooksService.update(owner, name, id, dto)
  }

  @Delete(':id')
  remove(@Param('owner') owner: string, @Param('name') name: string, @Param('id') id: string) {
    return this.webhooksService.remove(owner, name, id)
  }
}
