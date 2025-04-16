
const { logDebug, logInfo } = require('../utils/logger');

// Track readers online status
const rfidReaders = new Map();

// Process reader heartbeat
const processReaderHeartbeat = (readerId, status, io) => {
  logDebug(`Processing reader heartbeat for reader: ${readerId}, status: ${status}`);
  
  if (!rfidReaders.has(readerId)) {
    logInfo(`New RFID reader connected: ${readerId}`);
    rfidReaders.set(readerId, { 
      id: readerId,
      status: 'online',
      lastSeen: Date.now(),
      antennas: {}
    });
  } else {
    const reader = rfidReaders.get(readerId);
    reader.status = status || 'online';
    reader.lastSeen = Date.now();
    rfidReaders.set(readerId, reader);
    logDebug(`Updated reader status: ${readerId}, status: ${reader.status}`);
  }
  
  // Broadcast updated readers
  io.emit('readers_updated', Array.from(rfidReaders.values()));
};

// Get all RFID readers
const getRfidReaders = () => {
  return rfidReaders;
};

module.exports = {
  rfidReaders,
  processReaderHeartbeat,
  getRfidReaders
};
