
import { MqttConfig, WebSocketConfig } from './types';
import { ENV } from '@/config/environment';

// Get the MQTT config from localStorage or environment variables
// Optimized to reduce repeated localStorage access
export const getMqttConfig = (): MqttConfig => {
  // Get all required values from localStorage in a single batch
  const storedConfig = {
    brokerUrl: localStorage.getItem('mqtt_broker_url'),
    port: localStorage.getItem('mqtt_port'),
    username: localStorage.getItem('mqtt_username'),
    password: localStorage.getItem('mqtt_password'),
    topicPrefix: localStorage.getItem('mqtt_topic_prefix'),
    useTls: localStorage.getItem('mqtt_use_tls')
  };
  
  return {
    brokerUrl: storedConfig.brokerUrl || ENV.MQTT_BROKER_URL,
    port: parseInt(storedConfig.port || '') || ENV.MQTT_PORT,
    username: storedConfig.username || ENV.MQTT_USERNAME,
    password: storedConfig.password || ENV.MQTT_PASSWORD,
    clientId: `jewelry-dashboard-${Math.random().toString(16).substring(2, 10)}`,
    topicPrefix: storedConfig.topicPrefix || ENV.MQTT_TOPIC_PREFIX,
    useTls: storedConfig.useTls 
            ? storedConfig.useTls === 'true'
            : ENV.MQTT_USE_TLS,
  };
};

// Get the WebSocket endpoint from localStorage or environment variables
export const getServerUrl = (): string => {
  return localStorage.getItem('websocket_endpoint') || ENV.API_BASE_URL;
};

// Update the MQTT configuration with proper typing
export const updateMqttConfig = (config: Partial<MqttConfig | WebSocketConfig>): Promise<Record<string, any>> => {
  const serverUrl = getServerUrl();
  
  return fetch(`${serverUrl}/api/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })
    .then(response => response.json())
    .catch(error => {
      console.error('Error updating MQTT config:', error);
      throw error;
    });
};

// Test the MQTT connection with proper error handling and secure logging
export const testConnection = async (config: Partial<MqttConfig | WebSocketConfig>): Promise<{ success: boolean; message?: string }> => {
  try {
    // Log config without sensitive data
    console.log('[DEBUG] Attempting connection test with config:', {
      ...config,
      password: config.password ? '[REDACTED]' : 'not set'
    });

    const serverUrl = getServerUrl();
    const response = await fetch(`${serverUrl}/api/test-connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config)
    });
    
    console.log('[DEBUG] Connection test response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('[DEBUG] Connection test result:', result);
      return result;
    }
    
    // Fallback for non-200 responses
    console.error('[ERROR] Connection test failed with status:', response.status);
    return { success: false, message: `Server returned status: ${response.status}` };
  } catch (error) {
    console.error('[ERROR] Connection test caught error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during connection test' 
    };
  }
};
