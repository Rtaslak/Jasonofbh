
const { logDebug, logError, logInfo } = require('../utils/logger');
const { mqttConfig } = require('./config');

// Subscribe to required MQTT topics - updated to only include existing topics
const subscribeToTopics = (client, topicPrefix = mqttConfig.topicPrefix) => {
  // Department topics - only include the ones that exist
  const departmentTopics = [
    `${topicPrefix}jewelers/tagdata`,  
    `${topicPrefix}designers/tagdata`, 
    `${topicPrefix}setters/tagdata`
  ];
  
  // Subscribe to each department topic
  departmentTopics.forEach(topic => {
    client.subscribe(topic, (err) => {
      if (err) {
        logError(`Failed to subscribe to ${topic}:`, err);
      } else {
        logInfo(`Successfully subscribed to ${topic}`);
      }
    });
  });
  
  // Also subscribe to wildcard topic as a fallback
  const wildcardTopic = `${topicPrefix}#`;
  client.subscribe(wildcardTopic, (err) => {
    if (err) {
      logError(`Failed to subscribe to wildcard topic ${wildcardTopic}:`, err);
    } else {
      logInfo(`Successfully subscribed to wildcard topic ${wildcardTopic}`);
    }
  });
  
  logDebug('All MQTT topic subscriptions have been set up');
};

module.exports = {
  subscribeToTopics
};
