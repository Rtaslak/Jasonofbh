
const { logDebug, logError } = require('../utils/logger');

/**
 * Parse MQTT message payload into JSON
 * @param {String} payload - Raw MQTT message payload
 * @returns {Object|null} Parsed JSON object or null if parsing failed
 */
const parseMessagePayload = (payload) => {
  try {
    logDebug(`Parsing message payload (${payload.length} bytes)`);
    
    // Log a snippet of the message if it's very large
    if (payload.length > 1000) {
      logDebug(`Message snippet: ${payload.substring(0, 500)}...`);
    } else {
      logDebug(`Full message: ${payload}`);
    }
    
    return JSON.parse(payload);
  } catch (parseError) {
    logError('Error parsing MQTT message:', parseError);
    logError('Problematic message:', payload);
    return null;
  }
};

/**
 * Extract tag ID from various message formats
 * @param {Object} data - Parsed message data
 * @returns {String} Extracted tag ID or 'unknown'
 */
const extractTagId = (data) => {
  // Handle the nested data structure from Zebra FX readers
  if (data.data && data.data.idHex) {
    const tagId = data.data.idHex.toLowerCase(); // Normalize to lowercase
    logDebug(`Extracted tag ID from data.data.idHex: ${tagId}`);
    return tagId;
  }
  
  // Standard formats as fallbacks
  let tagId = data.tagId || data.epc || data.id || 
                (data.data && (data.data.epc)) || 'unknown';
  
  // Normalize to lowercase
  tagId = tagId.toLowerCase();        
  logDebug(`Extracted tag ID: ${tagId}`);
  return tagId;
};

/**
 * Extract reader ID from various message formats
 * @param {Object} data - Parsed message data
 * @returns {String} Extracted reader ID or 'default'
 */
const extractReaderId = (data) => {
  // Handle the hostName field from Zebra FX readers
  if (data.data && data.data.hostName) {
    const readerId = data.data.hostName.toLowerCase(); // Normalize to lowercase
    logDebug(`Extracted reader ID from data.data.hostName: ${readerId}`);
    return readerId;
  }
  
  // Standard formats as fallbacks
  let readerId = data.readerId || data.reader || 
                 (data.data && data.data.reader) || 'default';
  
  // Normalize to lowercase           
  readerId = readerId.toLowerCase();
  logDebug(`Extracted reader ID: ${readerId}`);
  return readerId;
};

/**
 * Extract antenna number from various message formats
 * @param {Object} data - Parsed message data
 * @returns {String} Extracted antenna number or '1'
 */
const extractAntennaNumber = (data) => {
  // Handle the antenna field from Zebra FX readers
  if (data.data && data.data.antenna !== undefined) {
    const antennaStr = data.data.antenna.toString();
    logDebug(`Extracted antenna number from data.data.antenna: ${antennaStr}`);
    return antennaStr;
  }
  
  // Standard formats as fallbacks
  const antennaNumber = data.antennaNumber || data.antenna || data.port || 
                        (data.data && data.data.port) || '1';
                        
  logDebug(`Extracted antenna number: ${antennaNumber}`);
  return antennaNumber;
};

/**
 * Extract signal strength (RSSI) from various message formats
 * @param {Object} data - Parsed message data
 * @returns {Number|null} Extracted RSSI value or null
 */
const extractRssi = (data) => {
  // Handle the peakRssi field from Zebra FX readers
  if (data.data && data.data.peakRssi !== undefined) {
    logDebug(`Extracted RSSI from data.data.peakRssi: ${data.data.peakRssi}`);
    return data.data.peakRssi;
  }
  
  // Standard formats as fallbacks
  const rssi = data.rssi || (data.data && data.data.rssi) || null;
  logDebug(`Extracted RSSI: ${rssi}`);
  return rssi;
};

/**
 * Create normalized RFID event object from parsed data
 * @param {Object} data - Parsed message data
 * @returns {Object} Normalized RFID event object
 */
const createRfidEvent = (data) => {
  return {
    tagId: extractTagId(data),
    readerId: extractReaderId(data),
    antennaNumber: extractAntennaNumber(data),
    timestamp: data.timestamp || Date.now(),
    rssi: extractRssi(data)
  };
};

/**
 * Extract reader ID for heartbeat messages
 * @param {Object} data - Parsed heartbeat data
 * @returns {String} Extracted reader ID
 */
const extractHeartbeatReaderId = (data) => {
  if (data.readerId) {
    return data.readerId.toLowerCase(); // Normalize to lowercase
  } else if (data.eventNum && data.type) {
    // Handle Zebra FX reader heartbeat format
    return (data.data && data.data.hostName && data.data.hostName.toLowerCase()) || 'unknown';
  }
  return null;
};

module.exports = {
  parseMessagePayload,
  extractTagId,
  extractReaderId,
  extractAntennaNumber,
  extractRssi,
  createRfidEvent,
  extractHeartbeatReaderId
};
