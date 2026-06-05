import { Injectable } from '@nestjs/common'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { Pool } from 'pg'

import { PrismaClient } from '../generated/prisma/client'

export function getFilePath(url: string): string {
  if (url.startsWith('file://')) {
    return url.replace('file://', '')
  }
  if (url.startsWith('file:')) {
    return url.replace('file:', '')
  }
  return url
}

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const filePath = getFilePath(process.env.DATABASE_URL || './dev.db')
    const pool = new Pool({ connectionString: filePath })
    const adapter = new PrismaBetterSqlite3(pool)
    super({ adapter })
  }
}
