
const mqtt = require('mqtt');
const { logInfo, logError, logDebug, logWarn } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Environment-based configuration with defaults
const MQTT_BROKER_URL = process.env.MQTT_URL || 'mqtts://a3u8umv97z6ekr-ats.iot.us-east-1.amazonaws.com';
const MQTT_USERNAME = process.env.MQTT_USERNAME;
const MQTT_PASSWORD = process.env.MQTT_PASSWORD;
const CLIENT_ID = `jewelry-dashboard-server-${Math.random().toString(16).substring(2, 10)}`;

// AWS IoT Core certificate paths (optional)
const CERT_DIR = process.env.MQTT_CERT_DIR;
const KEY_PATH = process.env.MQTT_KEY_PATH;
const CERT_PATH = process.env.MQTT_CERT_PATH;
const CA_PATH = process.env.MQTT_CA_PATH;

/**
 * Creates and configures an MQTT client with robust error handling
 * and reconnection logic optimized for AWS MQTT brokers
 */
function createMqttClient() {
  logInfo('Initializing MQTT client connection');
  
  const connectionOptions = {
    clientId: CLIENT_ID,
    clean: true,
    protocol: 'mqtts',
    reconnectPeriod: 2000,   // 2 second retry interval
    connectTimeout: 30000,   // 30 second connection timeout
    rejectUnauthorized: process.env.NODE_ENV === 'production', // For dev compatibility
  };

  // Configure auth - either username/password or certificates for AWS IoT Core
  if (MQTT_USERNAME && MQTT_PASSWORD) {
    // Use username/password auth (non-AWS IoT Core)
    connectionOptions.username = MQTT_USERNAME;
    connectionOptions.password = MQTT_PASSWORD;
    
    logDebug('MQTT using username/password authentication');
  } else if (CERT_PATH && KEY_PATH) {

    try {
      // Use certificate auth (AWS IoT Core)
      const certPath = CERT_PATH || path.join(CERT_DIR, 'certificate.pem.crt');
      const keyPath = KEY_PATH || path.join(CERT_DIR, 'private.pem.key');
      const caPath = CA_PATH || path.join(CERT_DIR, 'AmazonRootCA1.pem');
      
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        connectionOptions.cert = fs.readFileSync(certPath);
        connectionOptions.key = fs.readFileSync(keyPath);
        
        if (fs.existsSync(caPath)) {
          connectionOptions.ca = fs.readFileSync(caPath);
        }
        
        logDebug('MQTT using certificate-based authentication for AWS IoT Core');
      } else {
        logError('Required certificate files not found. Check CERT_PATH and KEY_PATH.');
      }
    } catch (err) {
      logError(`Error loading certificates: ${err.message}`);
    }
  }
  
  logDebug('MQTT connection options:', { 
    ...connectionOptions,
    password: connectionOptions.password ? '****' : undefined,
    key: connectionOptions.key ? '[KEY LOADED]' : undefined,
    cert: connectionOptions.cert ? '[CERT LOADED]' : undefined,
    ca: connectionOptions.ca ? '[CA LOADED]' : undefined
  });

logInfo('Cert loaded?', !!connectionOptions.cert);
logInfo('Key loaded?', !!connectionOptions.key);
logInfo('CA loaded?', !!connectionOptions.ca);


  const client = mqtt.connect(MQTT_BROKER_URL, connectionOptions);
  
  // Setup event handlers with improved logging
  client.on('connect', () => {
    logInfo('✅ MQTT client connected to broker');
  });
  
  client.on('reconnect', () => {
    logWarn('🔄 MQTT client reconnecting...');
  });
  
  client.on('error', (err) => {
    logError(`❌ MQTT client error: ${err.message}`);
  });
  
  client.on('offline', () => {
    logWarn('📵 MQTT client offline');
  });
  
  client.on('close', () => {
    logWarn('🚫 MQTT connection closed');
  });
  
  return client;
}

module.exports = {
  createMqttClient
};
