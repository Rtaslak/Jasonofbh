// server/src/mqtt/config.js
require('dotenv').config();

module.exports.mqttConfig = {
  brokerUrl: process.env.MQTT_BROKER_URL || 'localhost',
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  useTls: process.env.MQTT_USE_TLS === 'true',
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
  topicPrefix: process.env.MQTT_TOPIC_PREFIX || 'jewelry/rfid/',
  certPath: process.env.MQTT_CERT_PATH || '',
  keyPath: process.env.MQTT_KEY_PATH || '',
  caPath: process.env.MQTT_CA_PATH || ''
};
