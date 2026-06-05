import { Body, Controller, HttpCode, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { ValidateTokenDto } from './dto/validate-token.dto'

@Controller('api/auth')
export class ValidateController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(200)
  validateToken(@Body() dto: ValidateTokenDto) {
    return this.authService.validateToken(dto.token)
  }
}
