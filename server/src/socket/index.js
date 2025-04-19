// server/src/socket/index.js
const { logInfo, logDebug } = require('../utils/logger');


const setupSocketHandlers = (io) => {
  io.engine.pingTimeout = 60000;
  io.engine.pingInterval = 25000;

  const connectedClients = new Set(); // 🟢 Track connected clients

  io.on('connection', (socket) => {
    const clientId = socket.id;

    // ✅ Log only if this is a new client
    if (!connectedClients.has(clientId)) {
      connectedClients.add(clientId);
      logInfo(`Client connected: ${clientId}`);
    }

    // Immediately emit latest MQTT status
    const latest = global.latestMqttStatus || { connected: false, message: 'MQTT status unknown' };
    logDebug(`Sending MQTT status to ${clientId}:`, latest);
    socket.emit('mqtt_status', latest);

    socket.on('get_mqtt_status', () => {
      socket.emit('mqtt_status', global.latestMqttStatus || { connected: false });
    });

    socket.on('disconnect', (reason) => {
      connectedClients.delete(clientId);
    });
  });
};

module.exports = { setupSocketHandlers };
