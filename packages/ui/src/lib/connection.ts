/** VPN connection states — the single source for buttons, dots, banners and node status. */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

/** Default zh-CN copy per state (BRIEF §2.9). */
export const connectionStateLabel: Record<ConnectionState, string> = {
  disconnected: '连接',
  connecting: '连接中…',
  connected: '已连接',
  error: '连接失败，请重试',
};
