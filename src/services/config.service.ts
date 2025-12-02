import { WireguardBaseConfig } from '../types/wireguard'

export class ConfigService {
  private prepareDateString(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  prepareConfig(config: WireguardBaseConfig, displayName: string, expirationDate: Date): WireguardBaseConfig {
    config.DisplayName = displayName
    config.Filename = displayName
    this.changeExpirationDate(config, expirationDate)
    return config
  }

  changeExpirationDate(config: WireguardBaseConfig, expirationDate: Date): WireguardBaseConfig {
    config.ExpiresAt = this.prepareDateString(expirationDate)
    return config
  }
}
