
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';
import rfidService from '@/services/rfid';

/**
 * Hook for handling MQTT reconnection logic with exponential backoff
 */
export const useMqttReconnection = () => {
  const reconnectAttempts = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxReconnectAttempts = 3;  // Reduced from 10 to 3 to prevent excessive attempts

  const scheduleReconnect = useCallback(() => {
    // Don't schedule multiple reconnects
    if (reconnectTimerRef.current) {
      console.log('Reconnection already scheduled, skipping');
      return;
    }
    
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current++;
      
      // Exponential backoff with jitter
      const baseDelay = 3000; // Shortened delay to 3 seconds
      const jitter = Math.random() * 500;
      const delay = Math.min(baseDelay * Math.pow(1.5, reconnectAttempts.current - 1), 20000) + jitter;
      
      console.log(`WebSocket reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts} scheduled in ${Math.round(delay/1000)}s`);
      
      // Show reconnection attempt toast
      if (reconnectAttempts.current > 1) {
        toast.info(`Reconnecting to RFID system (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
      }
      
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        console.log(`Executing reconnection attempt ${reconnectAttempts.current}`);
        rfidService.connect();
      }, delay);
    } else {
      console.log('Maximum WebSocket reconnect attempts reached. User needs to manually reconnect.');
      
      toast.error('Connection issue', {
        description: 'Could not connect to RFID system after multiple attempts',
        action: {
          label: 'Try Again',
          onClick: () => {
            resetReconnectAttempts();
            rfidService.connect();
          }
        },
        duration: 10000  // Show for 10 seconds
      });
    }
  }, []);

  const resetReconnectAttempts = useCallback(() => {
    console.log('Resetting reconnection attempts counter');
    reconnectAttempts.current = 0;
    
    // Clear any pending reconnect timer
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      console.log('Clearing reconnection timer');
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  return {
    scheduleReconnect,
    resetReconnectAttempts,
    clearReconnectTimer,
    reconnectTimerRef
  };
};
