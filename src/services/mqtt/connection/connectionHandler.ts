
import { MqttClient } from 'mqtt';
import { toast } from 'sonner';
import { MqttConfig } from '../types';
import { createMqttConnection } from '../../mqtt/connection';
import mqttCore from '../core/mqttCore';
import reconnectionManager from './reconnectionManager';
import subscriptionManager from '../subscription/subscriptionManager';
import { parseRfidMessage } from '../eventHandling';
import { getDepartmentForReader } from '../config';

export function connect(): void {
  // Reset reconnect attempts when manually connecting
  reconnectionManager.resetReconnection();
  
  const client = mqttCore.getClient();
  if (client) {
    client.end(true);
  }

  mqttCore.setConnectionStatus('connecting');

  try {
    const config = mqttCore.getConfig();
    const newClient = createMqttConnection(
      config,
      handleConnect,
      handleError,
      handleClose,
      handleReconnect,
      handleMessage
    );
    
    mqttCore.setClient(newClient);
  } catch (error) {
    mqttCore.setConnectionStatus('error');
    reconnectionManager.scheduleReconnect(connect);
  }
}

export function disconnect(): void {
  // Clear any reconnect timers
  reconnectionManager.clearReconnectTimer();
  
  // Clear ping timer
  mqttCore.clearPingTimer();
  
  const client = mqttCore.getClient();
  if (client && client.connected) {
    client.end();
  }
  mqttCore.setConnectionStatus('disconnected');
}

function handleConnect(): void {
  console.log('MQTT Connected to broker');
  mqttCore.setConnectionStatus('connected');
  toast.success('Connected to RFID system');
  
  // Subscribe to topics
  const client = mqttCore.getClient();
  if (client) {
    // Subscribe to topics using the subscription manager
    subscriptionManager.subscribeToTopics(client, mqttCore.getConfig().topicPrefix);
  }
  
  // Set up ping interval
  mqttCore.setupPingInterval();
  
  // Reset reconnect attempts on successful connection
  reconnectionManager.resetReconnection();
}

function handleError(err: Error): void {
  console.error('MQTT connection error:', err);
  mqttCore.setConnectionStatus('error');
  toast.error(`RFID system connection error: ${err.message}`);
  reconnectionManager.scheduleReconnect(connect);
}

function handleClose(): void {
  console.log('MQTT connection closed');
  mqttCore.setConnectionStatus('disconnected');
  reconnectionManager.scheduleReconnect(connect);
}

function handleReconnect(): void {
  console.log('MQTT reconnecting...');
  mqttCore.setConnectionStatus('connecting');
}

function handleMessage(topic: string, message: Buffer): void {
  console.log(`Message received on topic: ${topic}`);
  
  // Process messages from department-specific topics
  if (topic.includes('/tagdata')) {
    console.log('Processing tag data message');
    const event = parseRfidMessage(topic, message, mqttCore.getConfig().topicPrefix);
    if (event) {
      // If no department ID was assigned during parsing, determine it from the reader ID
      if (!event.departmentId && event.stationId) {
        event.departmentId = getDepartmentForReader(event.stationId);
      }
      
      console.log('Valid RFID event parsed:', event);
      mqttCore.notifyTagEventListeners(event);
    }
  } else if (topic.includes('/events')) {
    console.log('Received heartbeat/events message');
    // Process heartbeat if needed
  } else {
    // Handle any other topics
    const event = parseRfidMessage(topic, message, mqttCore.getConfig().topicPrefix);
    if (event) {
      console.log('Valid RFID event parsed from custom topic:', event);
      mqttCore.notifyTagEventListeners(event);
    }
  }
}
