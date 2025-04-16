import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// RFID event interface
export interface RfidSocketEvent {
  topic: string;
  message: string;
  timestamp: number;
}

// Connection status type
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// Hook interface
export interface UseRfidSocketResult {
  connectionStatus: ConnectionStatus;
  latestEvent: RfidSocketEvent | null;
  connect: () => void;
  disconnect: () => void;
}

/**
 * Hook for connecting to the RFID WebSocket server
 * This implementation uses WebSocket bridge to MQTT
 */
export function useRfidSocket(): UseRfidSocketResult {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [latestEvent, setLatestEvent] = useState<RfidSocketEvent | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Get server URL from localStorage or env var
  const getServerUrl = (): string => {
    return localStorage.getItem('websocket_endpoint') || 
           import.meta.env.VITE_RFID_SERVER_URL || 
           'http://localhost:8000';
  };
  
  // Connect to the WebSocket server
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('Already connected to WebSocket server');
      return;
    }

    const serverUrl = getServerUrl();
    console.log(`Connecting to WebSocket server at ${serverUrl}`);
    setConnectionStatus('connecting');

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      transports: ['websocket'],
      forceNew: false
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setConnectionStatus('connected');
      toast.success('Connected to RFID system');
    });

    newSocket.on('disconnect', (reason) => {
      console.warn(`⚠️ Socket disconnected: ${reason}`);
      setConnectionStatus('disconnected');
      if (reason !== 'io client disconnect' && reason !== 'transport close') {
        toast.error('Disconnected from RFID system');
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`♻️ Socket reconnected after ${attemptNumber} attempts`);
      setConnectionStatus('connected');
      toast.success('RFID connection restored');
    });

    newSocket.on('connect_error', (error) => {
      console.error(`Connection error: ${error.message}`);
      setConnectionStatus('error');
      toast.error(`Connection error: ${error.message}`);
    });

    newSocket.on('rfid/message', (event: RfidSocketEvent) => {
      console.log('RFID event received:', event);
      setLatestEvent(event);
      try {
        const parsedData = JSON.parse(event.message);
        console.log('Parsed RFID data:', parsedData);
      } catch {
        console.log('Raw message (not JSON):', event.message);
      }
    });

    newSocket.on('rfid/event', (event: RfidSocketEvent) => {
      console.log('RFID event received:', event);
      setLatestEvent(event);
    });

    newSocket.on('rfid_event', (event: RfidSocketEvent) => {
      console.log('Legacy RFID event received:', event);
      setLatestEvent(event);
    });

    newSocket.on('mqtt/status', (status) => {
      console.log('MQTT status update:', status);
      if (status.connected) {
        toast.success('MQTT broker connected');
      } else if (status.error) {
        toast.error(`MQTT error: ${status.error}`);
      }
    });

    socketRef.current = newSocket;
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus('disconnected');
  }, []);

  useEffect(() => {
    if (localStorage.getItem('AUTO_CONNECT') === 'true') {
      connect();
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);

  return {
    connectionStatus,
    latestEvent,
    connect,
    disconnect
  };
}
