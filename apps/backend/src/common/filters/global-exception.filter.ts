import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import type { FastifyReply } from 'fastify'

import { AppError } from '../errors/app-error'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let body: Record<string, unknown> = { success: false, message: 'Internal server error' }

    if (exception instanceof AppError) {
      status = exception.statusCode
      body = { success: false, message: exception.message }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()
      if (typeof res === 'object' && res !== null) {
        body = {
          success: false,
          message: (res as Record<string, unknown>).message ?? exception.message,
          ...(res as Record<string, unknown>),
        }
      } else {
        body = { success: false, message: typeof res === 'string' ? res : exception.message }
      }
    } else if (exception instanceof Error) {
      body = { success: false, message: exception.message }
    }

    response.status(status).send(body)
  }
}
