const { logDebug } = require('../utils/logger');
const { processRfidEvent } = require('./eventProcessing');

const setupConnectionHandlers = (client, io) => {
  // Attach socket.io instance
  client._socketIo = io;

  // Existing handlers...
  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      logDebug(`📦 [MQTT] Message on topic: ${topic}`);

      // Only forward tag events to frontend (filter topics if needed)
      if (topic.includes('tagdata') || topic.includes('events')) {
        io.emit('rfid_event', payload); // ✅ Emit to frontend
      }

      // Optional: also run internal processing
      processRfidEvent(payload, io);
    } catch (err) {
      console.error('Failed to process MQTT message:', err.message);
    }
  });

  // Other handlers (connect, error, close...) stay unchanged
};

module.exports = {
  setupConnectionHandlers
};
