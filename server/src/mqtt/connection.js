
const mqtt = require('mqtt');
const { logDebug, logError } = require('../utils/logger');

// Connect to MQTT broker with improved error handling and stability
const connectToMqtt = (io) => {
  const { mqttConfig } = require('./config');
  
  try {
    logDebug(`Connecting to MQTT broker at ${mqttConfig.brokerUrl}:${mqttConfig.port}`);
    
    // Configure MQTT connection options - improved for production
    const options = {
      clientId: `rfid-server-${Math.random().toString(16).substring(2, 8)}`,
      port: mqttConfig.port,
      clean: true,
      // In production, this should be true. For development with self-signed certs, false may be needed
      rejectUnauthorized: process.env.NODE_ENV === 'production',
      reconnectPeriod: 5000,      // Attempt to reconnect every 5 seconds
      connectTimeout: 30000,      // 30 second timeout
      keepalive: 60               // Keepalive every 60 seconds
    };
    
    // Add credentials if provided
    if (mqttConfig.username && mqttConfig.password) {
      options.username = mqttConfig.username;
      options.password = mqttConfig.password;
    } else {
      logDebug('Warning: MQTT username or password not provided. Authentication may fail.');
    }
    
    // Build URL based on TLS setting
    const protocol = mqttConfig.useTls ? 'mqtts://' : 'mqtt://';
    const url = `${protocol}${mqttConfig.brokerUrl}`;
    
    logDebug(`MQTT URL: ${url}, Port: ${options.port}, Using TLS: ${mqttConfig.useTls}`);
    
    // Connect to the broker
    const client = mqtt.connect(url, options);
    
    // Store Socket.IO instance globally
    global.socketIo = io;
    
    // Handle connection events
    client.on('connect', () => {
      logDebug('Connected to MQTT broker');
      
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
      
      // Broadcast connection status to all clients
      if (io) {
        io.emit('mqtt_status', { 
          connected: true, 
          message: 'Connected to MQTT broker'
        });
      }
    });
    
    // Handle error event
    client.on('error', (err) => {
      logError(`MQTT Client Error: ${err.message}`);
      if (io) {
        io.emit('mqtt_status', { 
          connected: false, 
          error: err.message 
        });
      }
    });
    
    // Handle reconnect event
    client.on('reconnect', () => {
      logDebug('Attempting to reconnect to MQTT broker...');
      if (io) {
        io.emit('mqtt_status', { 
          connected: false, 
          message: 'Reconnecting to MQTT broker...'
        });
      }
    });
    
    // Handle close event
    client.on('close', () => {
      logDebug('MQTT connection closed');
      if (io) {
        io.emit('mqtt_status', { 
          connected: false, 
          message: 'Disconnected from MQTT broker'
        });
      }
    });
    
    // Forward MQTT messages to WebSocket clients
    client.on('message', (topic, message) => {
      if (io) {
        io.emit('mqtt-message', { 
          topic, 
          message: message.toString() 
        });
      }
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

// Simple test MQTT connection function without nested promises
const testMqttConnection = (config) => {
  return new Promise((resolve) => {
    const { brokerUrl, port, username, password, useTls } = config;
    
    // Create proper URL format
    const protocol = useTls ? 'mqtts://' : 'mqtt://';
    const url = `${protocol}${brokerUrl.replace(/^(mqtt|mqtts):\/\//, '')}`;
    
    const options = {
      clientId: `test-client-${Math.random().toString(16).substring(2, 8)}`,
      clean: true,
      reconnectPeriod: 0, // No automatic reconnection for test
      connectTimeout: 5000, // 5 second timeout
      port
    };

    if (username && password) {
      options.username = username;
      options.password = password;
    }

    // Create a test client for one-time connection test
    const client = mqtt.connect(url, options);
    let resolved = false;
    let timer = setTimeout(() => {
      if (!resolved) {
        client.end(true);
        resolve(false);
        resolved = true;
      }
    }, 5000);

    client.on('connect', () => {
      clearTimeout(timer);
      if (!resolved) {
        client.end(true);
        resolve(true);
        resolved = true;
      }
    });

    client.on('error', () => {
      clearTimeout(timer);
      if (!resolved) {
        client.end(true);
        resolve(false);
        resolved = true;
      }
    });
  });
};

module.exports = {
  connectToMqtt,
  testMqttConnection
};
