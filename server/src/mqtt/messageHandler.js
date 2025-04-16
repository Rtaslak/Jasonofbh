
const { logDebug, logError, logInfo } = require('../utils/logger');
const { parseMessagePayload, extractTagId, extractReaderId, extractAntennaNumber, createRfidEvent } = require('./parser');

// Function to determine department from topic
const getDepartmentFromTopic = (topic) => {
  if (topic.includes('jewelers/')) return 2;
  if (topic.includes('designers/')) return 1;
  if (topic.includes('setters/')) return 3;
  if (topic.includes('polisher/')) return 4;
  if (topic.includes('diamondCounting/')) return 5;
  if (topic.includes('shipping/')) return 6;
  return 2; // Default to jewelers
};

// Handle incoming MQTT messages
const handleMqttMessage = (topic, message, topicPrefix, io) => {
  try {
    const payload = message.toString();
    logDebug(`MQTT message received on ${topic} (${payload.length} bytes)`);
    
    // Parse the payload
    const data = parseMessagePayload(payload);
    if (!data) {
      return;
    }
    
    // Extract tag ID, ensuring it's normalized to lowercase
    let tagId = extractTagId(data);
    if (!tagId || tagId === 'unknown') {
      logDebug('No valid tag ID found in message');
      return;
    }
    
    // Normalize tag ID to lowercase
    tagId = tagId.toLowerCase();
    
    // Extract reader ID, ensuring it's normalized to lowercase
    const readerId = extractReaderId(data).toLowerCase();
    
    // Extract antenna number
    const antennaNumber = extractAntennaNumber(data);
    
    // Determine department from topic or from reader mapping
    let departmentId;
    
    if (topic.includes('/')) {
      departmentId = getDepartmentFromTopic(topic);
      logDebug(`Determined department ${departmentId} from topic ${topic}`);
    } else {
      // Department will be determined on client side based on reader ID
      departmentId = null;
      logDebug(`Department will be determined by client based on reader ID ${readerId}`);
    }
    
    // Create standardized RFID event object
    const rfidEvent = createRfidEvent(data);
    rfidEvent.departmentId = departmentId;  // Add department ID if determined
    
    logDebug(`Sending RFID event to clients: ${JSON.stringify(rfidEvent)}`);
    
    // Broadcast the event to all connected WebSocket clients
    io.emit('rfid_event', rfidEvent);
    
  } catch (error) {
    logError('Error handling MQTT message:', error);
  }
};

module.exports = {
  handleMqttMessage,
  getDepartmentFromTopic
};
