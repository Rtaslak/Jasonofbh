const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');
const { logDebug, logError } = require('../utils/logger');
const { processRfidEvent } = require('./eventProcessing');
const topics = require('./topics');
const { mqttConfig } = require('./config');

const connectToMqtt = (io) => {
  try {
    logDebug(`Connecting to MQTT broker at ${mqttConfig.brokerUrl}:${mqttConfig.port} (TLS: ${mqttConfig.useTls})`);

    const options = {
      clientId: `rfid-server-${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      keepalive: 60
    };

    if (mqttConfig.useTls === true || mqttConfig.useTls === 'true') {
      try {
        options.cert = fs.readFileSync(path.resolve(mqttConfig.certPath));
        options.key = fs.readFileSync(path.resolve(mqttConfig.keyPath));
        options.ca = fs.readFileSync(path.resolve(mqttConfig.caPath));
        options.rejectUnauthorized = true;
        logDebug('✅ TLS certs loaded successfully');
      } catch (err) {
        logError(`❌ Failed to load TLS certs: ${err.message}`);
      }
    }

    const client = mqtt.connect(mqttConfig.brokerUrl, options);
    if (io) client._socketIo = io;

    // ✅ Store globally for reuse
    global.mqttClient = client;

    // ✅ On connect
    client.on('connect', () => {
      const status = {
        connected: true,
        message: 'Connected to MQTT broker'
      };
      global.latestMqttStatus = status;
      if (io) io.emit('mqtt_status', status);

      const topicList = topics.getAllTopics();
      logDebug(`📡 Subscribing to ${topicList.length} topics...`);

      topicList.forEach(topic => {
        client.subscribe(topic, (err) => {
          if (err) {
            logError(`❌ Failed to subscribe to ${topic}: ${err.message}`);
          } else {
            logDebug(`✅ Subscribed to ${topic}`);
          }
        });
      });
    });

    // ✅ On message
    client.on('message', (topic, message) => {
      try {
        const parsed = JSON.parse(message.toString());
        processRfidEvent(parsed, io); // Handles tag-to-order linking, emits to frontend
      } catch (err) {
        logError(`❌ Failed to parse MQTT message: ${err.message}`);
      }
    });

    // ✅ On error
    client.on('error', (err) => {
      const status = {
        connected: false,
        message: `MQTT error: ${err.message}`
      };
      global.latestMqttStatus = status;
      if (io) io.emit('mqtt_status', status);
      logError(`❌ MQTT Error: ${err.message}`);
    });

    // ✅ On close
    client.on('close', () => {
      const status = {
        connected: false,
        message: 'Disconnected from MQTT broker'
      };
      global.latestMqttStatus = status;
      if (io) io.emit('mqtt_status', status);
      logDebug('⚠️ MQTT connection closed');
    });

    // ✅ On reconnect
    client.on('reconnect', () => {
      const status = {
        connected: false,
        message: 'Reconnecting to MQTT broker...'
      };
      global.latestMqttStatus = status;
      if (io) io.emit('mqtt_status', status);
      logDebug('♻️ Reconnecting to MQTT broker...');
    });

    // ✅ On offline
    client.on('offline', () => {
      const status = {
        connected: false,
        message: 'MQTT client is offline'
      };
      global.latestMqttStatus = status;
      if (io) io.emit('mqtt_status', status);
      logDebug('📴 MQTT client went offline');
    });

    return client;

  } catch (err) {
    const status = {
      connected: false,
      message: `MQTT Connection Error: ${err.message}`
    };
    global.latestMqttStatus = status;
    if (io) io.emit('mqtt_status', status);
    logError(`🚨 MQTT Fatal Error: ${err.message}`);
    return null;
  }
};

module.exports = { connectToMqtt };
