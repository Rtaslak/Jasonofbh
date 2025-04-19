// src/hooks/mqtt/useMqttConnection.ts
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface RfidEvent {
  tagId: string;
  readerId: string;
}

export interface MqttContextProps {
  connectionStatus: ConnectionStatus;
  latestEvent: RfidEvent | null;
  connect: () => void;
  disconnect: () => void;
}

export function useMqttConnection(): MqttContextProps {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [latestEvent, setLatestEvent] = useState<RfidEvent | null>(null);

  useEffect(() => {
    socket.on('mqtt_status', (status) => {
      console.log('[WebSocket] mqtt_status:', status);
      const newStatus: ConnectionStatus = status.connected ? 'connected' : 'disconnected';
      setConnectionStatus(newStatus);
    });

    socket.on('rfid_event', (event: RfidEvent) => {
      setLatestEvent(event);
    });

    return () => {
      socket.off('mqtt_status');
      socket.off('rfid_event');
    };
  }, []);

  return {
    connectionStatus,
    latestEvent,
    connect: () => {},     // Placeholder
    disconnect: () => {},  // Placeholder
  };
}
