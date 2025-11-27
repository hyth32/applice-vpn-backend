import { HealthRepository } from '../repositories/health.repository'

const healthRepository = new HealthRepository()

export class HealthService {
  async check() {
    await healthRepository.ping()
  }
}
