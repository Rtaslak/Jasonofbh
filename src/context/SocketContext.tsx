
import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

// Define context types
interface SocketContextType {
  socket: Socket | null;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  connect: () => void;
  disconnect: () => void;
}

// Create the context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  // Get server URL from localStorage or env var
  const getServerUrl = useCallback((): string => {
    return localStorage.getItem('websocket_endpoint') || 
           import.meta.env.VITE_RFID_SERVER_URL || 
           'http://localhost:8000';
  }, []);

  // Connect to server
  const connect = useCallback(() => {
    // Check if already connected
    if (socketRef.current?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Check for demo mode
    if (localStorage.getItem('DEMO_MODE') === 'true') {
      console.log('Running in demo mode - simulating connected state');
      setStatus('connected');
      return;
    }

    const serverUrl = getServerUrl();
    console.log(`Connecting to WebSocket server at ${serverUrl}`);
    setStatus('connecting');

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new socket
    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      transports: ['websocket'],
      forceNew: false
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('🔌 Socket connected');
      setStatus('connected');
      toast.success('Connected to server');
    });

    newSocket.on('disconnect', (reason) => {
      console.warn(`⚠️ Socket disconnected: ${reason}`);
      setStatus('disconnected');
      
      // Don't show toast for normal disconnections
      if (reason !== 'io client disconnect' && reason !== 'transport close') {
        toast.error('Disconnected from server');
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`♻️ Socket reconnected after ${attemptNumber} attempts`);
      setStatus('connected');
      toast.success('Connection restored');
    });

    newSocket.on('connect_error', (error) => {
      console.error(`Connection error: ${error.message}`);
      setStatus('error');
      toast.error(`Connection error: ${error.message}`);
    });

    socketRef.current = newSocket;
  }, [getServerUrl]);

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('disconnected');
  }, []);

  // Auto-connect if AUTO_CONNECT is set
  useEffect(() => {
    if (localStorage.getItem('AUTO_CONNECT') === 'true' && 
        localStorage.getItem('DEMO_MODE') !== 'true') {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);

  return (
    <SocketContext.Provider value={{ 
      socket: socketRef.current, 
      status, 
      connect, 
      disconnect 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
