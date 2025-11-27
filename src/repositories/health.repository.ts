import { prisma } from '../lib/prisma'

export class HealthRepository {
  async ping() {
    await prisma.$queryRaw`SELECT 1`
  }
}
