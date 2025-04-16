import { RfidEvent } from '@/services/rfid/types';
import { toast } from 'sonner';
import { processTagEvent } from '@/utils/mqtt/eventProcessing';

/**
 * Processes an RFID event from the server
 */
export const handleRfidEvent = (event: RfidEvent): void => {
  console.log("[DEBUG] RFID Event received from server:", event);

  toast.info(`RFID Tag Detected: ${event.tagId}`, {
    description: `Department: ${event.departmentId || 'unknown'}, Reader: ${event.readerId}, Antenna: ${event.antennaNumber || 'unknown'}`,
  });

  processTagEvent(event);
};

/**
 * Gets the WebSocket server URL from localStorage or environment
 */
export const getServerUrl = (): string => {
  return localStorage.getItem('websocket_endpoint') || 
         import.meta.env.VITE_RFID_SERVER_URL || 
         'http://localhost:8000';
};
