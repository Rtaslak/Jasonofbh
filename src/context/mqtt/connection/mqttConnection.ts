import { useState, useCallback, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { toast } from 'sonner';
import { ConnectionStatus } from '../types';
import { getServerUrl } from '../utils';
import { setupRfidEventHandlers } from './eventHandlers';

// Extend the Socket type to include our custom property
interface ExtendedSocket extends Socket {
  pingInterval?: NodeJS.Timeout;
}

export function useMqttConnectionService() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [socket, setSocket] = useState<ExtendedSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanupSocket = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (socket) {
      if (socket.connected) {
        socket.disconnect();
      }
      setSocket(null);
    }
  }, [socket]);

  const connect = useCallback(() => {
    if (socket && socket.connected) {
      console.log('[DEBUG] Already connected, not reconnecting');
      setConnectionStatus('connected');
      return;
    }

    const serverUrl = getServerUrl();
    console.log(`[DEBUG] Connecting to WebSocket server at ${serverUrl}`);
    setConnectionStatus('connecting');

    cleanupSocket();

    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      transports: ['polling', 'websocket'],
      forceNew: true,
      withCredentials: false,
      autoConnect: true
    }) as ExtendedSocket;

    newSocket.on('connect', () => {
      console.log('[DEBUG] Connected to WebSocket server');
      setConnectionStatus('connected');
      localStorage.setItem('AUTO_CONNECT', 'true');
      newSocket.emit('get_mqtt_status');
      toast.success('Connected to RFID system');
    });

    newSocket.on('disconnect', (reason) => {
      console.log(`[DEBUG] Disconnected from WebSocket server: ${reason}`);
      setConnectionStatus('disconnected');
      toast.error('RFID system disconnected: ' + reason);
    });

    newSocket.on('connect_error', (error) => {
      console.error(`[ERROR] Connection error: ${error.message}`);
      setConnectionStatus('disconnected');
      toast.error(`Connection failed: ${error.message}`);
    });

    setupRfidEventHandlers(newSocket, setConnectionStatus);

    const pingInterval = setInterval(() => {
      if (newSocket.connected) {
        console.log('[DEBUG] Sending ping to keep connection alive');
        newSocket.emit('ping');
      }
    }, 25000);

    pingIntervalRef.current = pingInterval;
    setSocket(newSocket);

    return () => {
      cleanupSocket();
    };
  }, [socket, cleanupSocket]);

  const disconnect = useCallback(() => {
    console.log('[DEBUG] Disconnecting from WebSocket server');
    cleanupSocket();
    localStorage.setItem('AUTO_CONNECT', 'false');
    setConnectionStatus('disconnected');
  }, [cleanupSocket]);

  useEffect(() => {
    return () => {
      cleanupSocket();
    };
  }, [cleanupSocket]);

  return {
    connect,
    disconnect,
    connectionStatus,
    socket
  };
}
