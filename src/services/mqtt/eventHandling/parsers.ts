
import { RfidEvent } from '../types';
import { mapStationToDepartment, getDepartmentFromTopic } from './mappers';

/**
 * Parse MQTT message from any topic
 */
export function parseRfidMessage(topic: string, messageBuffer: Buffer, topicPrefix: string): RfidEvent | null {
  try {
    const message = messageBuffer.toString();
    console.log(`Message received on ${topic}: ${message}`);

    // For the fixed rfid/tagdata topic
    if (topic.includes('rfid/tagdata')) {
      return parseTagDataMessage(message, topic);
    }

    // For department-specific topics
    if (topic.includes('/tagdata')) {
      let departmentId = getDepartmentFromTopic(topic);
      return parseTagDataMessage(message, topic, departmentId);
    }

    // Otherwise, try to parse as JSON
    try {
      const data = JSON.parse(message);
      
      // Handle Zebra FX reader format
      if (data.data && data.data.idHex) {
        const rfidEvent: RfidEvent = {
          tagId: data.data.idHex.toLowerCase(), // Normalize to lowercase
          stationId: (data.data.hostName || 'unknown').toLowerCase(),
          readerId: (data.data.hostName || 'unknown').toLowerCase(),
          timestamp: data.timestamp || Date.now(),
          rssi: data.data.peakRssi,
          antennaNumber: data.data.antenna?.toString(),
          departmentId: mapStationToDepartment((data.data.hostName || 'unknown').toLowerCase()),
        };
        return rfidEvent;
      }
      
      // Standard format
      const rfidEvent: RfidEvent = {
        tagId: (data.tagId || data.epc || data.id || '').toLowerCase(), // Normalize to lowercase
        stationId: (data.stationId || data.reader || data.station || 'unknown').toLowerCase(),
        readerId: (data.readerId || data.reader || data.station || 'unknown').toLowerCase(),
        timestamp: data.timestamp || Date.now(),
        rssi: data.rssi,
        departmentId: mapStationToDepartment((data.stationId || data.reader || data.station || 'unknown').toLowerCase()),
      };

      return rfidEvent;
    } catch (parseError) {
      console.error('Error parsing MQTT message:', parseError, message);
      return null;
    }
  } catch (error) {
    console.error('Error handling MQTT message:', error);
    return null;
  }
}

/**
 * Special parser for the tagdata topic format
 */
function parseTagDataMessage(message: string, topic: string, departmentId?: number): RfidEvent | null {
  try {
    const data = JSON.parse(message);
    
    // Handle nested data structure from Zebra FX readers
    if (data.data && data.data.idHex) {
      const rfidEvent: RfidEvent = {
        tagId: data.data.idHex.toLowerCase(), // Normalize to lowercase
        stationId: (data.data.hostName || 'unknown').toLowerCase(),
        readerId: (data.data.hostName || 'unknown').toLowerCase(),
        timestamp: data.timestamp || Date.now(),
        rssi: data.data.peakRssi,
        antennaNumber: data.data.antenna?.toString(),
        departmentId: departmentId || mapStationToDepartment((data.data.hostName || 'unknown').toLowerCase()),
      };
      
      console.log('Parsed RFID event from Zebra FX format:', rfidEvent);
      return rfidEvent;
    }
    
    // Standard format
    const rfidEvent: RfidEvent = {
      tagId: (data.epc || data.tagId || data.id || '').toLowerCase(), // Normalize to lowercase
      stationId: (data.readerId || data.reader || data.station || 'unknown').toLowerCase(),
      readerId: (data.readerId || data.reader || data.station || 'unknown').toLowerCase(),
      timestamp: data.timestamp || Date.now(),
      rssi: data.rssi,
      departmentId: departmentId || mapStationToDepartment((data.readerId || data.reader || data.station || 'unknown').toLowerCase()),
    };
    
    console.log('Parsed RFID event from tagdata:', rfidEvent);
    
    return rfidEvent;
  } catch (error) {
    console.error('Error parsing tag data message:', error, message);
    return null;
  }
}
