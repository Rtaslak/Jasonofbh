
const { logInfo, logDebug, logError } = require('../utils/logger');

// Setup Socket.IO connection handlers
const setupSocketHandlers = (io) => {
  // Configure more stable global socket settings
  io.engine.pingTimeout = 60000; // 60 second ping timeout
  io.engine.pingInterval = 25000; // 25 second ping interval

  // Track connected clients to reduce log spam
  const connectedClients = new Set();

  // Connection event handler
  io.on('connection', (socket) => {
    const clientId = socket.id;
    
    if (!connectedClients.has(clientId)) {
      connectedClients.add(clientId);
      logInfo(`Client connected: ${clientId}`);
    }
    
    // Send the current MQTT status as soon as a client connects
    const mqttClient = global.mqttClient;
    const isConnected = mqttClient && mqttClient.connected;
    
    logDebug(`Socket connection - Sending initial MQTT status to client (connected: ${isConnected})`);
    
    // Send the initial MQTT status to the newly connected client
    socket.emit('mqtt_status', { 
      connected: isConnected,
      message: isConnected ? 'Connected to MQTT broker' : 'Not connected to MQTT broker'
    });
    
    // Handle client requesting MQTT status explicitly
    socket.on('get_mqtt_status', () => {
      logDebug(`Client ${clientId} requested MQTT status`);
      const mqttClient = global.mqttClient;
      const isConnected = mqttClient && mqttClient.connected;
      
      socket.emit('mqtt_status', {
        connected: isConnected,
        message: isConnected ? 'Connected to MQTT broker' : 'Not connected to MQTT broker'
      });
    });
    
    // Handle client requesting to forward raw MQTT messages
    socket.on('subscribe_raw_mqtt', () => {
      logDebug(`Client ${clientId} subscribed to raw MQTT messages`);
      socket.join('raw-mqtt-room');
    });
    
    socket.on('unsubscribe_raw_mqtt', () => {
      logDebug(`Client ${clientId} unsubscribed from raw MQTT messages`);
      socket.leave('raw-mqtt-room');
    });

    // Handle test connection requests
    socket.on('test_mqtt_connection', (config) => {
      logDebug(`Client ${clientId} requested MQTT connection test with config: ${JSON.stringify({...config, password: '****'})}`);
      
      // Import the test function here to avoid circular dependencies
      const { testMqttConnection } = require('../mqtt/connection');
      
      testMqttConnection(config)
        .then(result => {
          socket.emit('test_mqtt_result', { 
            success: result,
            message: result ? 'Connection successful' : 'Connection failed'
          });
        })
        .catch(err => {
          socket.emit('test_mqtt_result', { 
            success: false,
            message: `Error: ${err.message}`
          });
        });
    });

    // Simplified ping handler to ensure connection stays alive
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Disconnect event handler
    socket.on('disconnect', (reason) => {
      connectedClients.delete(clientId);
      
      // Only log disconnects that aren't from normal transport events
      if (reason !== 'transport close' && reason !== 'ping timeout') {
        logInfo(`Client disconnected: ${clientId}, reason: ${reason}`);
      }
    });
  });
};

module.exports = {
  setupSocketHandlers
};
