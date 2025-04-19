// server/src/mqtt/topics.js
const { mqttConfig } = require('./config');

module.exports = {
  TAG_DATA_TOPIC: `${mqttConfig.topicPrefix}+\/tagdata`,
  EVENT_TOPIC: `${mqttConfig.topicPrefix}+\/events`,
  getAllTopics: () => [
    `${mqttConfig.topicPrefix}+\/tagdata`,
    `${mqttConfig.topicPrefix}+\/events`
  ]
};
