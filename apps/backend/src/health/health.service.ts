import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthService {
  getHealth(): Record<string, number> {
    return {
      uptime: process.uptime(),
    }
  }
}
