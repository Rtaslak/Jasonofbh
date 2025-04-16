import { io } from 'socket.io-client';
import rfidCore from './rfidCore';

// Initialize the service
export const initService = (): void => {
  rfidCore.setConnectionStatus('disconnected');
};

// Connect to the WebSocket server
export const connect = (): void => {
  if (rfidCore.getSocket()) {
    console.log('Socket already exists, not creating a new one');
    return;
  }

  rfidCore.setConnectionStatus('connecting');

  const serverUrl = rfidCore.getServerUrl();

  const socketOptions = {
    forceNew: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
    timeout: 10000,
  };

  console.log(`Connecting to RFID server at ${serverUrl} with options:`, socketOptions);

  try {
    const socket = io(serverUrl, socketOptions);
    rfidCore.setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to RFID server');
      rfidCore.setConnectionStatus('connected');

      socket.emit('client_handshake', {
        clientType: 'jewelry-dashboard',
        version: '1.0',
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected from RFID server. Reason: ${reason}`);
      rfidCore.setConnectionStatus('disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
      rfidCore.setConnectionStatus('disconnected');
    });

    socket.on('rfid_event', (event: any) => {
      console.log('RFID event received:', event);
      rfidCore.notifyTagEvent(event);
    });

    socket.on('order_updated', (order: any) => {
      console.log('Order updated:', order);
      rfidCore.notifyOrderUpdate(order);
    });

    socket.on('departments_updated', (departments: any) => {
      console.log('Departments updated:', departments);
      rfidCore.notifyDepartmentUpdate(departments);
    });

    socket.on('readers_updated', (readers: any) => {
      console.log('Readers updated:', readers);
      rfidCore.notifyReadersUpdate(readers);
    });
  } catch (error) {
    console.error('Error creating socket connection:', error);
    rfidCore.setConnectionStatus('error');
  }
};

// Disconnect from the WebSocket server
export const disconnect = (): void => {
  const socket = rfidCore.getSocket();
  if (socket) {
    socket.disconnect();
    rfidCore.setSocket(null);
    rfidCore.setConnectionStatus('disconnected');
  }
};
