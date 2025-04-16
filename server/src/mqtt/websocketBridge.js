
const { logInfo, logError, logDebug } = require('../utils/logger');
const { parseMessagePayload, extractTagId, extractReaderId, extractAntennaNumber } = require('./parser');
const { getDepartmentForReader } = require('./config');

/**
 * Creates a bridge between MQTT and WebSockets
 * This allows clients to receive MQTT messages via WebSocket
 */
const createMqttWebSocketBridge = (mqttClient, io) => {
  if (!mqttClient || !io) {
    logError('Cannot create MQTT-WebSocket bridge: missing client or io');
    return null;
  }

  logInfo('Setting up MQTT-WebSocket bridge');

  // Configure Socket.IO for better stability
  io.engine.pingTimeout = 60000; // Longer ping timeout (60 seconds)
  io.engine.pingInterval = 25000; // Reasonable ping interval (25 seconds)

  // Forward MQTT connection status to WebSocket clients
  const broadcastMqttStatus = (connected, message = '', error = null) => {
    const statusData = {
      connected,
      message: message || (connected ? 'Connected to MQTT broker' : 'Disconnected from MQTT broker')
    };
    
    if (error) {
      statusData.error = error;
    }
    
    logDebug(`Broadcasting MQTT status to WebSocket clients: ${JSON.stringify(statusData)}`);
    io.emit('mqtt/status', statusData);
  };

  // Set up MQTT client event handlers
  mqttClient.on('connect', () => {
    logInfo('MQTT connected, broadcasting to WebSocket clients');
    broadcastMqttStatus(true);
  });

  mqttClient.on('reconnect', () => {
    logDebug('MQTT reconnecting, notifying WebSocket clients');
    broadcastMqttStatus(false, 'Reconnecting to MQTT broker');
  });

  mqttClient.on('error', (err) => {
    logError(`MQTT error: ${err.message}`);
    broadcastMqttStatus(false, null, err.message);
  });

  mqttClient.on('close', () => {
    logInfo('MQTT connection closed, notifying WebSocket clients');
    broadcastMqttStatus(false);
  });

  // Set up WebSocket event handlers - reduce verbose logging
  io.on('connection', (socket) => {
    logInfo(`WebSocket client connected: ${socket.id}`);
    
    // Send current MQTT connection status to newly connected client
    broadcastMqttStatus(mqttClient.connected);
    
    // Handle client disconnect - reduce logging verbosity
    socket.on('disconnect', (reason) => {
      if (reason !== 'transport close' && reason !== 'ping timeout') {
        // Only log abnormal disconnects to reduce log spam
        logInfo(`WebSocket client disconnected: ${socket.id} (${reason})`);
      }
    });
  });

  // Handle incoming MQTT messages and forward to WebSocket clients
  mqttClient.on('message', (topic, message) => {
    logDebug(`MQTT message received on topic: ${topic}`);
    
    try {
      const messageStr = message.toString();
      
      // Parse the message to extract tag data
      const data = parseMessagePayload(messageStr);
      if (data) {
        // Extract important data
        const tagId = extractTagId(data);
        const readerId = extractReaderId(data);
        const antennaNumber = extractAntennaNumber(data);
        const departmentId = getDepartmentForReader(readerId);
        
        // Create standardized event with minimal required data
        const rfidEvent = {
          tagId,
          readerId,
          antennaNumber,
          departmentId,
          timestamp: Date.now()
        };
        
        // Emit the event with minimal payload using namespaced events
        io.emit('rfid/event', rfidEvent);
        
        // Also emit the raw message for legacy compatibility
        io.emit('rfid/message', {
          topic,
          message: messageStr,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      logError(`Error processing MQTT message: ${error.message}`);
    }
  });

  return {
    broadcastStatus: broadcastMqttStatus
  };
};

module.exports = {
  createMqttWebSocketBridge
};
