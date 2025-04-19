// server/src/mqtt/eventProcessing.js
const { logDebug } = require('../utils/logger');

function processRfidEvent(message, io) {
  logDebug('Processing RFID event:', message);

  if (message.tagId) {
    io.emit('rfid_event', {
      tagId: message.tagId,
      readerId: message.readerId || 'unknown'
    });
  }
}

module.exports = { processRfidEvent };
