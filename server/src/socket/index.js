const { logInfo, logDebug } = require('../utils/logger');

// Setup Socket.IO connection handlers
const setupSocketHandlers = (io) => {
  io.engine.pingTimeout = 60000;
  io.engine.pingInterval = 25000;

  const connectedClients = new Set();

  io.on('connection', (socket) => {
    const clientId = socket.id;
    if (!connectedClients.has(clientId)) {
      connectedClients.add(clientId);
      logInfo(`Client connected: ${clientId}`);
    }

    // ✅ Immediately emit latest MQTT status to new clients
    const latest = global.latestMqttStatus || { connected: false, message: 'MQTT status unknown' };
    logDebug(`Sending MQTT status to ${clientId}:`, latest);
    socket.emit('mqtt_status', latest);

    // Optional: respond to client requests for status
    socket.on('get_mqtt_status', () => {
      socket.emit('mqtt_status', global.latestMqttStatus || { connected: false });
    });

    socket.on('disconnect', (reason) => {
      connectedClients.delete(clientId);
    });
  });
};

module.exports = { setupSocketHandlers };
