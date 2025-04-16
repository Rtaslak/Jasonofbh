
const { createMqttClient } = require('./client');
const topics = require('./topics');
const { processRfidEvent } = require('./eventProcessor');
const { createMqttWebSocketBridge } = require('./websocketBridge');
const { logInfo, logError, logDebug } = require('../utils/logger');
const { initializeTagMapping } = require('./tagMapping');

/**
 * Connects to MQTT broker and sets up message handling with WebSocket bridging
 * @param {Object} io - Socket.IO server instance
 * @returns {Object|null} MQTT client instance or null if connection failed
 */
const connectMqtt = (io) => {
  try {
    // Create MQTT client
    const mqttClient = createMqttClient();
    
    if (!mqttClient) {
      logError('Failed to create MQTT client');
      if (io) {
        io.emit('mqtt_status', { 
          connected: false, 
          error: 'Failed to create MQTT client' 
        });
      }
      return null;
    }
    
    // Initialize tag mapping
    initializeTagMapping();
    
    // Create WebSocket bridge
    const bridge = createMqttWebSocketBridge(mqttClient, io);
    
    // Subscribe to all topics
    const allTopics = topics.getAllTopics();
    logInfo(`Subscribing to ${allTopics.length} topics`);
    
    mqttClient.subscribe(allTopics, (err, granted) => {
      if (err) {
        logError(`Error subscribing to topics: ${err.message}`);
        return;
      }
      
      if (granted && granted.length) {
        granted.forEach(({topic, qos}) => {
          logDebug(`Subscribed to ${topic} with QoS ${qos}`);
        });
      }
    });
    
    // Handle incoming messages
    mqttClient.on('message', (topic, message) => {
      try {
        logDebug(`Message received on topic: ${topic}`);
        
        // Parse message
        const messageStr = message.toString();
        let messageData;
        
        try {
          messageData = JSON.parse(messageStr);
        } catch (e) {
          logError(`Failed to parse message as JSON: ${messageStr}`);
          return;
        }
        
        // Process message based on topic
        if (topic === topics.TAG_DATA_TOPIC) {
          // Process tag data
          processRfidEvent(messageData, io);
        } else if (topic.includes('/departments/')) {
          // Department-specific processing
          processRfidEvent(messageData, io);
        } else if (topic === topics.SYSTEM_STATUS_TOPIC) {
          // System status message
          if (io) {
            io.emit('system_status', messageData);
          }
        }
        
        // Note: If more topics are added in the future, consider moving this routing
        // logic to a dedicated messageRouter.js module.
      } catch (error) {
        logError(`Error processing message: ${error.message}`);
      }
    });
    
    return mqttClient;
    
  } catch (error) {
    logError(`Failed to connect to MQTT broker: ${error.message}`);
    if (io) {
      io.emit('mqtt_status', { 
        connected: false, 
        error: `Connection error: ${error.message}` 
      });
    }
    return null;
  }
};

module.exports = {
  connectMqtt,
  // Re-export rfidReaders and getRfidReaders for backward compatibility
  rfidReaders: require('./readerManager').rfidReaders,
  getRfidReaders: require('./readerManager').getRfidReaders,
  mqttConfig: require('./config').mqttConfig
};
