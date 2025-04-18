import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export type ConnectionStatus = 'connected' | 'disconnected';

interface RfidEvent {
  tagId: string;
  readerId?: string;
  timestamp?: string;
}

interface MqttContextProps {
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
      console.log('[MQTT STATUS]', status);
      setConnectionStatus(status.connected ? 'connected' : 'disconnected');
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
    connect: () => {},
    disconnect: () => {},
  };
}
