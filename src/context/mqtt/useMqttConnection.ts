import { useState, useEffect, useCallback } from 'react';
import { RfidEvent } from './types';
import { ConnectionStatus } from './types';
import { useMqttConnectionService } from './connection/mqttConnection';

export function useMqttConnection() {
  const { connect, disconnect, connectionStatus, socket } = useMqttConnectionService();
  const [latestEvent, setLatestEvent] = useState<RfidEvent | null>(null);

  const [shouldConnect, setShouldConnect] = useState(
    localStorage.getItem('AUTO_CONNECT') === 'true'
  );

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (shouldConnect) {
      cleanup = connect() as unknown as (() => void) | undefined;
    }

    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }

      if (socket) {
        socket.disconnect();
      }
    };
  }, [shouldConnect, connect, socket]);

  return {
    connectionStatus,
    latestEvent,
    connect: useCallback(() => {
      connect();
      setShouldConnect(true);
    }, [connect]),
    disconnect: useCallback(() => {
      disconnect();
      setShouldConnect(false);
    }, [disconnect])
  };
}
