import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit: 50 * 1024 * 1024 }),
  )

  // Activamos validación global estricta para los DTOs (login, register, etc.)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Habilitamos CORS para que el monorepo de Astro se comunique sin bloqueos de origen
  app.enableCors({ origin: 'http://localhost:4321' })

  // Registrar parser raw para los endpoints Git Smart HTTP
  const httpAdapter = app.getHttpAdapter()
  const fastifyInstance = httpAdapter.getInstance()
  fastifyInstance.addContentTypeParser(
    ['application/x-git-upload-pack-request', 'application/x-git-receive-pack-request'],
    { parseAs: 'buffer', bodyLimit: 50 * 1024 * 1024 },
    function (_req: any, body: Buffer, done: (err: Error | null, body: Buffer) => void) {
      done(null, body)
    },
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
