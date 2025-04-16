
const { logDebug, logError } = require('./logger');

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
  const tagId = (data.tagId || data.epc || data.id || 'unknown').toLowerCase();
  logDebug(`Extracted tag ID: ${tagId}`);
  return tagId;
};

/**
 * Extract reader ID from various message formats
 * @param {Object} data - Parsed message data
 * @returns {String} Extracted reader ID or 'unknown'
 */
const extractReaderId = (data) => {
  // Handle the nested data structure from Zebra FX readers
  if (data.data && data.data.hostName) {
    const readerId = data.data.hostName.toLowerCase();
    logDebug(`Extracted reader ID from data.data.hostName: ${readerId}`);
    return readerId;
  }
  
  // Standard formats as fallbacks
  const readerId = (data.readerId || data.reader || data.stationId || 'unknown').toLowerCase();
  logDebug(`Extracted reader ID: ${readerId}`);
  return readerId;
};

/**
 * Extract antenna number from various message formats
 * @param {Object} data - Parsed message data
 * @returns {String} Extracted antenna number as string or '0'
 */
const extractAntennaNumber = (data) => {
  // Handle the nested data structure from Zebra FX readers
  if (data.data && data.data.antenna !== undefined) {
    const antenna = String(data.data.antenna);
    logDebug(`Extracted antenna number from data.data.antenna: ${antenna}`);
    return antenna;
  }
  
  // Standard formats as fallbacks
  const antenna = data.antennaNumber || data.antenna || '0';
  const antennaStr = String(antenna);
  logDebug(`Extracted antenna number: ${antennaStr}`);
  return antennaStr;
};

module.exports = {
  parseMessagePayload,
  extractTagId,
  extractReaderId,
  extractAntennaNumber
};
