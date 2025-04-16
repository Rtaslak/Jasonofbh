
import { RfidEvent } from '@/services/rfid/types';

// Connection status types
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Re-export RfidEvent type for internal use
export type { RfidEvent };

// Context interface
export interface MqttContextProps {
  connectionStatus: ConnectionStatus;
  latestEvent: RfidEvent | null;
  connect: () => void;
  disconnect: () => void;
}
