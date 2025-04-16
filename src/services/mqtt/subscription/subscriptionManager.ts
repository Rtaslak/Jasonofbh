
import { MqttClient } from 'mqtt';
import { standardTopics } from '../config';

/**
 * Subscribe to all required MQTT topics
 * @param client The MQTT client
 * @param topicPrefix Optional topic prefix (will be prepended to standard topics)
 */
export function subscribeToTopics(client: MqttClient, topicPrefix: string = ''): void {
  // If we already have the prefix in the standard topics, we can use them directly
  if (standardTopics[0].startsWith(topicPrefix)) {
    // Subscribe to each standard topic
    standardTopics.forEach(topic => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          console.log(`Successfully subscribed to ${topic}`);
        }
      });
    });
  } else {
    // Add the prefix to each topic
    standardTopics.forEach(topic => {
      const fullTopic = `${topicPrefix}${topic}`;
      client.subscribe(fullTopic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${fullTopic}:`, err);
        } else {
          console.log(`Successfully subscribed to ${fullTopic}`);
        }
      });
    });
  }
  
  // Subscribe to wildcard topic for catching all messages
  const wildcardTopic = `${topicPrefix}#`;
  client.subscribe(wildcardTopic, (err) => {
    if (err) {
      console.error(`Failed to subscribe to wildcard topic ${wildcardTopic}:`, err);
    } else {
      console.log(`Successfully subscribed to wildcard topic ${wildcardTopic}`);
    }
  });
  
  console.log('All MQTT topic subscriptions have been set up');
}

// Export the subscription manager functions
const subscriptionManager = {
  subscribeToTopics
};

export default subscriptionManager;
