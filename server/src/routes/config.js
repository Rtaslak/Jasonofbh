
const { connectMqtt } = require('../mqtt');
const { getMqttConfig, updateMqttConfig } = require('../mqtt/config');
const { testMqttConnection } = require('../mqtt/connection');

module.exports = (app, io) => {
  // Get MQTT configuration
  app.get('/api/config', (req, res) => {
    const config = getMqttConfig();
    const mqttClient = global.mqttClient;
    
    res.status(200).send({
      topicPrefix: config.topicPrefix,
      brokerUrl: config.brokerUrl,
      port: config.port,
      username: config.username,
      useTls: config.useTls,
      connected: mqttClient && mqttClient.connected
    });
  });

  // Update MQTT configuration
  app.post('/api/config', (req, res) => {
    const { brokerUrl, port, username, password, topicPrefix, useTls } = req.body;
    
    // Update configuration with new values
    const updatedConfig = updateMqttConfig({
      brokerUrl, 
      port, 
      username, 
      password, 
      topicPrefix, 
      useTls
    });
    
    // Reconnect with new configuration
    const newClient = connectMqtt(io);
    
    // Update the global reference
    global.mqttClient = newClient;
    
    res.status(200).send({
      message: 'Configuration updated',
      config: {
        brokerUrl: updatedConfig.brokerUrl,
        port: updatedConfig.port,
        username: updatedConfig.username ? '****' : null,
        topicPrefix: updatedConfig.topicPrefix,
        useTls: updatedConfig.useTls
      }
    });
  });

  // Test connection endpoint with simplified logic
  app.post('/api/test-connection', async (req, res) => {
    const { brokerUrl, port, username, password, topicPrefix, useTls } = req.body;
    
    console.log('[DEBUG] Test Connection Request:', { 
      brokerUrl, 
      port, 
      username: username ? '****' : 'not set', 
      topicPrefix 
    });

    try {
      const testResult = await testMqttConnection({
        brokerUrl,
        port,
        username,
        password,
        topicPrefix,
        useTls
      });
      
      console.log('[DEBUG] Test Connection Result:', testResult);
      
      res.status(200).json({
        success: testResult,
        message: testResult 
          ? 'Successfully connected to MQTT broker' 
          : 'Failed to connect to MQTT broker',
        config: getMqttConfig()
      });
    } catch (error) {
      console.error('[ERROR] Connection Test Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Unexpected error during connection test',
        config: getMqttConfig()
      });
    }
  });
};
