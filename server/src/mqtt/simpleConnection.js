
const mqtt = require('mqtt');
const { logInfo, logError, logDebug } = require('../utils/logger');
const { createMqttWebSocketBridge } = require('./websocketBridge');

/**
 * Simple MQTT connection handler that bridges MQTT to WebSockets
 */
const connectSimpleMqtt = (io) => {
  const { mqttConfig } = require('./config');
  
  // Log connection attempt
  logInfo(`Connecting to MQTT broker at ${mqttConfig.brokerUrl}:${mqttConfig.port}`);
  
  // Build URL based on TLS setting
  const protocol = mqttConfig.useTls ? 'mqtts://' : 'mqtt://';
  const url = `${protocol}${mqttConfig.brokerUrl}`;
  
  // Configure MQTT connection options
  const options = {
    clientId: `rfid-server-${Math.random().toString(16).substring(2, 8)}`,
    port: mqttConfig.port,
    clean: true,
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    reconnectPeriod: 5000,
    connectTimeout: 30000,
    keepalive: 60
  };
  
  // Add credentials if provided
  if (mqttConfig.username && mqttConfig.password) {
    options.username = mqttConfig.username;
    options.password = mqttConfig.password;
    logDebug('Using MQTT authentication');
  } else {
    logDebug('Warning: MQTT username or password not provided. Authentication may fail.');
  }
  
  try {
    // Connect to the broker
    const client = mqtt.connect(url, options);
    
    // Set up WebSocket bridge
    createMqttWebSocketBridge(client, io);
    
    // Handle connection events
    client.on('connect', () => {
      logInfo('Connected to MQTT broker');
      
      // Subscribe to configured topics
      const { topicPrefix } = mqttConfig;
      const topics = [
        `${topicPrefix}+/tagdata`,
        `${topicPrefix}+/events`
      ];
      
      topics.forEach(topic => {
        client.subscribe(topic, (err) => {
          if (err) {
            logError(`Failed to subscribe to ${topic}: ${err.message}`);
          } else {
            logDebug(`Subscribed to topic: ${topic}`);
          }
        });
      });
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logDebug('SIGINT received, closing MQTT connection...');
      client.end(true, () => {
        logDebug('MQTT connection closed cleanly');
        process.exit(0);
      });
    });
    
    return client;
  } catch (error) {
    logError(`MQTT Connection Error: ${error.message}`);
    if (io) {
      io.emit('mqtt_status', { 
        connected: false, 
        error: error.message 
      });
    }
    return null;
  }
};

module.exports = {
  connectSimpleMqtt
};
