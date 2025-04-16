
import { Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { ConnectionStatus, RfidEvent } from '../types';
import { handleRfidEvent } from '../utils';

/**
 * Sets up all the event handlers for RFID-related events
 */
export function setupRfidEventHandlers(
  socket: Socket,
  setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>
) {
  // Listen for MQTT status updates
  socket.on('mqtt_status', (status) => {
    console.log('[DEBUG] MQTT status update received:', status);
    
    if (status && typeof status.connected === 'boolean') {
      // Update connection status
      setConnectionStatus(status.connected ? 'connected' : 'disconnected');
      
      // Show toast for significant status changes
      if (status.connected) {
        toast.success('RFID system connected');
      } else {
        toast.error('RFID system disconnected');
      }
    }
  });
  
  // Listen for RFID events
  socket.on('rfid_event', (event: RfidEvent) => {
    console.log('[DEBUG] RFID event received:', event);
    handleRfidEvent(event);
  });
}

/**
 * Sets up event handlers specifically for MQTT errors
 */
export function setupErrorHandlers(socket: Socket) {
  socket.on('mqtt_error', (error) => {
    console.error('[ERROR] MQTT error received:', error);
    
    // Display different toast messages based on error type
    if (error.code === 'AUTH_ERROR') {
      toast.error('MQTT authentication failed', {
        description: 'Please check your credentials in Settings',
      });
    } else if (error.code === 'DNS_ERROR') {
      toast.error('Cannot connect to MQTT broker', {
        description: 'The broker hostname could not be resolved',
      });
    } else {
      toast.error(`MQTT error: ${error.message || 'Unknown error'}`);
    }
  });
}
