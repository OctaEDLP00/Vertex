import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  )

  // Activamos validación global estricta para los DTOs (login, register, etc.)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Habilitamos CORS para que el monorepo de Astro se comunique sin bloqueos de origen
  app.enableCors({ origin: 'http://localhost:4321' })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
