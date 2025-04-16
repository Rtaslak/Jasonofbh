
// Configuration management for MQTT connections
const { logDebug, logInfo, logError } = require('../utils/logger');

// Initial MQTT configuration with proper fallbacks
const mqttConfig = {
  brokerUrl: process.env.MQTT_BROKER_URL || 'cyanqueen-lr5usy.a01.euc1.aws.hivemq.cloud',
  port: parseInt(process.env.MQTT_PORT || '8883'),
  username: process.env.MQTT_USERNAME || '',
  password: process.env.MQTT_PASSWORD || '',
  topicPrefix: process.env.MQTT_TOPIC_PREFIX || 'JBH/',
  useTls: process.env.MQTT_USE_TLS === 'false' ? false : true
};

// Log the initial configuration (without sensitive data)
logDebug('MQTT Config - Initial configuration:');
logDebug(`Broker URL: ${mqttConfig.brokerUrl}`);
logDebug(`Port: ${mqttConfig.port}`);
logDebug(`Username set: ${mqttConfig.username ? 'Yes' : 'No'}`);
logDebug(`Password set: ${mqttConfig.password ? 'Yes' : 'No'}`);
logDebug(`Topic Prefix: ${mqttConfig.topicPrefix}`);
logDebug(`Use TLS: ${mqttConfig.useTls}`);

// Check configuration for obvious issues
if (!mqttConfig.brokerUrl) {
  logError('MQTT configuration error: Missing broker URL');
}

if (!mqttConfig.username || !mqttConfig.password) {
  logDebug('MQTT configuration warning: Missing credentials');
}

// Mapping of station IDs to department IDs - server-side version
const stationToDepartmentMapping = {
  // Map Zebra FX reader hostnames to departments
  'FX96006e8f12': 2,  // Jewelers department
  'Fx96006e8fB7': 3,  // Setters department
  
  // Legacy mappings for compatibility
  'designer-station1': 1,
  'designer-station2': 1,
  'jeweler-roger': 2,
  'jeweler-tro': 2,
  'jeweler-vicken': 2,
  'jeweler-simon': 2,
  'jeweler-hratch': 2,
  'jeweler-ara': 2,
  'jeweler-hrant': 2,
  'jeweler-ardziv': 2,
  'polisher-station': 4,
  'diamond-counting': 5,
  'shipping-station': 6
};

// Get MQTT configuration (returns a sanitized copy)
const getMqttConfig = () => {
  logDebug('MQTT Config - Getting sanitized config');
  // Return a copy without the password for security
  return {
    ...mqttConfig,
    password: undefined // Don't include password in any API responses
  };
};

// Update MQTT configuration
const updateMqttConfig = (config) => {
  logDebug('MQTT Config - Updating configuration');
  
  // Log sanitized config
  const sanitizedConfig = { ...config, password: config.password ? '[REDACTED]' : 'not set' };
  logDebug(`New config received: ${JSON.stringify(sanitizedConfig)}`);
  
  if (config.brokerUrl) mqttConfig.brokerUrl = config.brokerUrl;
  if (config.port) mqttConfig.port = parseInt(config.port);
  if (config.username) mqttConfig.username = config.username;
  if (config.password) mqttConfig.password = config.password;
  if (config.topicPrefix) mqttConfig.topicPrefix = config.topicPrefix;
  if (config.useTls !== undefined) mqttConfig.useTls = config.useTls;
  
  logDebug('MQTT Config - Updated configuration:');
  logDebug(`Broker URL: ${mqttConfig.brokerUrl}`);
  logDebug(`Port: ${mqttConfig.port}`);
  logDebug(`Username set: ${mqttConfig.username ? 'Yes' : 'No'}`);
  logDebug(`Password set: ${mqttConfig.password ? 'Yes' : 'No'}`);
  logDebug(`Topic Prefix: ${mqttConfig.topicPrefix}`);
  logDebug(`Use TLS: ${mqttConfig.useTls}`);
  
  // Return sanitized config
  return {
    ...mqttConfig,
    password: undefined
  };
};

// Method to get department ID from a station/reader ID
const getDepartmentForReader = (readerId) => {
  return stationToDepartmentMapping[readerId] || 2; // Default to jewelers (ID: 2)
};

module.exports = {
  mqttConfig,
  getMqttConfig,
  updateMqttConfig,
  stationToDepartmentMapping,
  getDepartmentForReader
};
