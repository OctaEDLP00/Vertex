import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { Pool } from 'pg'

import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaBetterSqlite3(pool)
const prisma = new PrismaClient({ adapter })

/** Helper promise to execute native OS Git commands easily. */
const runGitCommand = (args: readonly string[], cwd: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const process = spawn('git', args, { cwd })
    process.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`Git command failed: git ${args.join(' ')}`))
    })
  })
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Limpiar registros previos (Evita duplicados en desarrollo por las restricciones @unique)
  await prisma.comment.deleteMany()
  await prisma.pullRequest.deleteMany()
  await prisma.issue.deleteMany()
  await prisma.webhook.deleteMany()
  await prisma.personalAccessToken.deleteMany()
  await prisma.repository.deleteMany()
  await prisma.user.deleteMany()

  // 2. Crear usuarios de prueba (password crudo: 'password123' -> idealmente usar bcrypt/argon2 en producción)
  const octaUser = await prisma.user.create({
    data: {
      username: 'OctaEDLP00',
      name: 'Octavio',
      lastName: 'Caro',
      email: 'octavio.caro@vertex.dev',
      password: '$argon2id$v=19$m=65536,t=3,p=4$fakehashforseeding', // Simulación de password hash
      role: 'ADMIN',
    },
  })

  const ariveraUser = await prisma.user.create({
    data: {
      username: 'arivera',
      name: 'Alex',
      lastName: 'Rivera',
      email: 'arivera@vertex.dev',
      password: '$argon2id$v=19$m=65536,t=3,p=4$fakehashforseeding',
      role: 'USER',
    },
  })

  console.log('✅ Users successfully seeded.')

  // 3. Crear un Personal Access Token (PAT) de desarrollo para el usuario principal
  await prisma.personalAccessToken.create({
    data: {
      name: 'VSCode Development Token',
      token: 'vtx_pat_dev_secret_123456789',
      scopes: 'repo:read,repo:write,user',
      userId: octaUser.id,
    },
  })

  // 4. Crear el Repositorio Core "vertex" en Base de Datos y en Almacenamiento Físico
  const storagePath = join(process.cwd(), 'git-storage', octaUser.id, 'vertex.git')

  // Inicializar repositorio bare en disco físico
  await mkdir(storagePath, { recursive: true })
  await runGitCommand(['init', '--bare'], storagePath)

  const repository = await prisma.repository.create({
    data: {
      name: 'vertex',
      description: 'The open-source, minimalist and lightning-fast alternative to GitHub.',
      isPrivate: false,
      localPath: storagePath,
      ownerId: octaUser.id,
    },
  })

  console.log(`✅ Repository "vertex" physically initialized in: ${storagePath}`)

  // 5. Crear un Issue dentro del repositorio
  const issue = await prisma.issue.create({
    data: {
      number: 1,
      title: 'Setup Oxc linting metrics interface layout',
      body: 'We need to display speed optimization metrics directly on the dashboard logs layout.',
      status: 'OPEN',
      repositoryId: repository.id,
      authorId: octaUser.id,
    },
  })

  // 6. Crear un Pull Request con el tag personalizado de código <Code>
  const pullRequest = await prisma.pullRequest.create({
    data: {
      number: 2,
      title: 'feat: implement virtual scroll item auto-height calculation',
      body: 'Implements layout calculation safety layers for responsive file explorer listings.',
      status: 'OPEN',
      sourceBranch: 'feature/virtual-scroll',
      targetBranch: 'main',
      repositoryId: repository.id,
      authorId: ariveraUser.id,
    },
  })

  // 7. Añadir la discusión/comentario del PR imitando fielmente la imagen de tu mockup
  await prisma.comment.create({
    data: {
      body: `Great initiative. I looked over the memoization, and it mostly looks solid. However, I noticed a potential issue in how we calculate the item height dynamically.

<Code title="VirtualScrollContainer.tsx" lang="ts">
const itemHeight = ref.current?.clientHeight || 40; // Fallback
const itemHeight = useMemo(() => calculateAverageHeight(items), [items]);
</Code>

Relying on the ref immediately might cause layout thrashing. Maybe we can pre-calculate based on the known row types?`,
      authorId: ariveraUser.id,
      pullRequestId: pullRequest.id,
    },
  })

  // 8. Crear un Webhook de prueba para integración continua externa
  await prisma.webhook.create({
    data: {
      url: 'https://api.vertex-ci.local/webhooks/push',
      secret: 'vtx_webhook_secret_key_98765',
      events: 'push,pull_request',
      isActive: true,
      repositoryId: repository.id,
    },
  })

  console.log('✅ Mock Issues, Pull Requests, Comments and Webhooks seeded.')
  console.log('🌿 Seeding completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Error during seeding process:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
