
import { processRfidEvent } from '@/utils/orders/rfidEventProcessing';
import { RfidEvent } from '@/services/mqtt/types';

/**
 * Process an RFID event and update the system accordingly
 */
export const processTagEvent = (event: RfidEvent | null) => {
  if (!event || !event.tagId) {
    console.log('[DEBUG] Received invalid RFID event (null or no tagId)');
    return;
  }
  
  console.log("[DEBUG] Processing RFID event:", event);
  
  // Normalize the tag ID to lowercase to ensure consistent matching
  const tagId = event.tagId.toLowerCase();
  const readerId = (event.readerId || 'unknown').toLowerCase();
  
  // Process the event to move the order to the right department and station
  const result = processRfidEvent(
    tagId, 
    readerId
  );
  
  // Add detailed logging
  console.log(`[DEBUG] Tag event processed for tag ID: ${tagId}. Reader: ${readerId}`);
  console.log(`[DEBUG] Result:`, result);
  
  // Dispatch a minimal payload for UI updates
  window.dispatchEvent(new CustomEvent('orderUpdated', { 
    detail: { 
      tagId: tagId, 
      readerId: readerId,
      timestamp: Date.now(),
      result: result
    }
  }));
};
