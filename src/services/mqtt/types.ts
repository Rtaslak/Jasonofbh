
// Define the RFID event types
export interface RfidEvent {
  tagId: string;
  readerId?: string;
  antennaNumber?: string | number;
  stationId?: string;
  timestamp?: number;
  rssi?: number;
  departmentId?: number;
}

// Define reader information
export interface RfidReader {
  id: string;
  status: 'online' | 'offline';
  lastSeen: number;
  antennas: Record<string, {
    number: string | number;
    lastSeen: number;
  }>;
}

// Define the connection status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// Define the event handlers
export type StatusChangeCallback = (status: ConnectionStatus) => void;
export type TagEventCallback = (event: RfidEvent) => void;
export type OrderUpdateCallback = (order: any) => void;
export type DepartmentUpdateCallback = (departments: any) => void;
export type ReadersUpdateCallback = (readers: RfidReader[]) => void;

// MQTT configuration type
export interface MqttConfig {
  brokerUrl: string;
  port: number;
  username: string;
  password: string;
  clientId: string;
  topicPrefix: string;
  useTls: boolean;
}

// WebSocket configuration type - Updated to match the MQTT config structure
// since it's used interchangeably in the codebase
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
