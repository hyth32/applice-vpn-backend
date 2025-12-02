export type WireguardOverridable<T> = {
  Value: T
  Overridable: boolean
}

export type WireguardBaseConfig = {
  Identifier: string
  DisplayName: string
  UserIdentifier: string
  InterfaceIdentifier: string
  Disabled: boolean
  DisabledReason: string
  Notes: string
  Endpoint: WireguardOverridable<string>
  EndpointPublicKey: WireguardOverridable<string>
  AllowedIPs: WireguardOverridable<string[]>
  ExtraAllowedIPs: string[]
  PresharedKey: string
  PersistentKeepalive: WireguardOverridable<number>
  PrivateKey: string
  PublicKey: string
  Mode: string
  Addresses: string[]
  CheckAliveAddress: string
  Dns: WireguardOverridable<string[]>
  DnsSearch: WireguardOverridable<string[]>
  Mtu: WireguardOverridable<number>
  FirewallMark: WireguardOverridable<number>
  RoutingTable: WireguardOverridable<string>
  PreUp: WireguardOverridable<string>
  PostUp: WireguardOverridable<string>
  PreDown: WireguardOverridable<string>
  PostDown: WireguardOverridable<string>
  Filename: string
  ExpiresAt: string
}
