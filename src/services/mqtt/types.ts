// src/services/mqtt/types.ts

// ✅ RFID Event type
export interface RfidEvent {
  tagId: string;
  readerId?: string;
  antennaNumber?: string | number;
  stationId?: string;
  timestamp?: number;
  rssi?: number;
  departmentId?: number;
}

// ✅ Reader structure
export interface RfidReader {
  id: string;
  status: 'online' | 'offline';
  lastSeen: number;
  antennas: Record<string, {
    number: string | number;
    lastSeen: number;
  }>;
}

// ✅ Connection status types
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// ✅ Callback types
export type StatusChangeCallback = (status: ConnectionStatus) => void;
export type TagEventCallback = (event: RfidEvent) => void;
export type OrderUpdateCallback = (order: any) => void;
export type DepartmentUpdateCallback = (departments: any) => void;
export type ReadersUpdateCallback = (readers: RfidReader[]) => void;

// ✅ MQTT Config
export interface MqttConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  topicPrefix: string;
  useTls: boolean;
}

// ✅ WebSocket-style Config (compatible with MQTT config)
export interface WebSocketConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  topicPrefix: string;
  useTls: boolean;
  websocketEndpoint?: string;
}

// ✅ Context shape for React MQTT Provider
export interface MqttContextProps {
  connectionStatus: ConnectionStatus;
  latestEvent: RfidEvent | null;
  connect: () => void;
  disconnect: () => void;
}
