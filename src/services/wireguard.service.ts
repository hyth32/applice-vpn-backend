import { log } from 'console'
import { WireguardBaseConfig } from '../types/wireguard'
import { ConfigService } from './config.service'

const WIREGUARD_URL = process.env.WIREGUARD_URL
const WIREGUARD_USERNAME = process.env.WIREGUARD_USERNAME
const WIREGUARD_PASSWORD = process.env.WIREGUARD_PASSWORD

type JsonPayload = Record<string, unknown>

export class WireguardService {
  configService = new ConfigService()

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(init.headers as Record<string, string>),
    }

    if (init.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const authHeader = this.getAuthHeader()
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const response = await fetch(`${WIREGUARD_URL}${path}`, { ...init, headers })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      const message = errorText || response.statusText || 'Wireguard API request failed'
      throw new Error(`Wireguard API error (${response.status}): ${message}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      return (await response.json()) as T
    }

    return (await response.text()) as unknown as T
  }

  private getAuthHeader(): string | undefined {
    if (!WIREGUARD_USERNAME || !WIREGUARD_PASSWORD) {
      throw new Error('Wireguard credentials are not configured')
    }

    const credentials = `${WIREGUARD_USERNAME}:${WIREGUARD_PASSWORD}`
    return `Basic ${Buffer.from(credentials).toString('base64')}`
  }

  async getBaseConfig(): Promise<WireguardBaseConfig> {
    return this.request<WireguardBaseConfig>(`/peer/prepare/wg0`, {
      method: 'GET',
    })
  }

  async createPeer(displayName: string): Promise<WireguardBaseConfig> {
    const baseConfig = await this.getBaseConfig()
    const date = new Date()
    const config = this.configService.prepareConfig(baseConfig, displayName, date)

    return this.request<WireguardBaseConfig>('/peer/new', {
      method: 'POST',
      body: JSON.stringify(config),
    })
  }

  async getPeer<T = unknown>(peerId: string): Promise<T> {
    return this.request<T>(`/peer/by-id/${encodeURIComponent(peerId)}`, {
      method: 'GET',
    })
  }

  async updatePeer<T = unknown>(peerId: string, payload: JsonPayload): Promise<T> {
    return this.request<T>(`/peer/by-id/${encodeURIComponent(peerId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  async deletePeer(peerId: string): Promise<void> {
    await this.request(`/peer/by-id/${encodeURIComponent(peerId)}`, {
      method: 'DELETE',
    })
  }
}
