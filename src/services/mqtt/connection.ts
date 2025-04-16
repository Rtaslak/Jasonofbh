import { ConnectionStatus, MqttConfig } from './types';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import { toast } from 'sonner';

// Create MQTT connection with improved error handling and stability
export function createMqttConnection(
  config: MqttConfig,
  onConnect: () => void,
  onError: (err: Error) => void,
  onClose: () => void,
  onReconnect: () => void,
  onMessage: (topic: string, message: Buffer) => void
): MqttClient {
  const { brokerUrl, username, password, clientId, useTls, port } = config;

  const protocol = useTls ? 'mqtts://' : 'mqtt://';
  const url = `${protocol}${brokerUrl}`;

  const options: IClientOptions = {
    clientId,
    clean: true,
    reconnectPeriod: 5000, // Try to reconnect every 5 seconds
    connectTimeout: 30000, // 30 second timeout
    keepalive: 60, // Send a keepalive packet every 60 seconds
    resubscribe: true, // Automatically resubscribe to topics
    // In production, this should be true. For dev or self-signed certs, may need false
    rejectUnauthorized: import.meta.env.MODE === 'production'
  };

  // Add authentication if provided
  if (username && password) {
    options.username = username;
    options.password = password;
  } else {
    console.warn('MQTT username or password not provided. Authentication may fail.');
  }

  // Add port if specified
  if (port) {
    options.port = port;
  }

  let connectionAttempts = 0;
  const maxConnectionAttempts = 3; // Try to connect a maximum of 3 times

  console.log(`Connecting to MQTT broker at ${url} with options:`, {
    ...options,
    password: options.password ? '****' : undefined,
  });
  
  const client = mqtt.connect(url, options);

  // Enhanced event handling
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    connectionAttempts = 0; // Reset connection attempts
    onConnect();
  });
  
  client.on('error', (err) => {
    console.error('MQTT Error:', err.message);
    onError(err);
    handleConnectionError(client);
  });
  
  client.on('close', () => {
    console.log('MQTT connection closed');
    onClose();
    handleConnectionError(client);
  });
  
  client.on('reconnect', () => {
    console.log('MQTT reconnecting...');
    onReconnect();
  });
  
  client.on('message', onMessage);
  
  // Add additional event handlers for better connection management
  client.on('disconnect', () => {
    console.log('MQTT broker requested disconnect');
    handleConnectionError(client);
  });
  
  client.on('offline', () => {
    console.log('MQTT client is offline, will attempt to reconnect');
    handleConnectionError(client);
  });

  // Setup clean disconnect on page unload
  window.addEventListener('beforeunload', () => {
    if (client.connected) {
      client.end(true);
    }
  });

  // Function to handle connection errors and implement retry logic
  function handleConnectionError(client: MqttClient) {
    if (connectionAttempts < maxConnectionAttempts) {
      connectionAttempts++;
      console.log(`Reconnection attempt ${connectionAttempts} of ${maxConnectionAttempts}`);
      toast.warning(`Reconnecting to RFID system... Attempt ${connectionAttempts}`);
      
      // We don't need to create a new client - the existing one will try to reconnect
      // based on its reconnectPeriod setting. We just need to track the attempts.
    } else if (connectionAttempts === maxConnectionAttempts) {
      // Increment to avoid showing this message multiple times
      connectionAttempts++;
      console.error(`Failed to connect to MQTT broker after ${maxConnectionAttempts} attempts`);
      toast.error(`Failed to connect to RFID system after multiple attempts`, {
        description: `Please check your network connection and MQTT broker configuration`
      });
    }
    // After max attempts, the built-in reconnection of the client will continue,
    // but we won't show more toasts or take additional actions
  }

  return client;
}

// Test MQTT connection with improved error handling
export function testMqttConnection(config: MqttConfig): Promise<boolean> {
  return new Promise((resolve) => {
    const { brokerUrl, username, password, useTls, port } = config;
    const protocol = useTls ? 'mqtts://' : 'mqtt://';
    const url = `${protocol}${brokerUrl}`;
    
    const options: IClientOptions = {
      clientId: `test-client-${Math.random().toString(16).substring(2, 10)}`,
      clean: true,
      reconnectPeriod: 0, // Don't auto-reconnect for the test
      connectTimeout: 10000, // 10 seconds timeout
    };
    
    if (username && password) {
      options.username = username;
      options.password = password;
    }
    
    if (port) {
      options.port = port;
    }
    
    const testClient = mqtt.connect(url, options);
    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        testClient.end(true);
        resolve(false);
        resolved = true;
      }
    }, 10000);
    
    testClient.on('connect', () => {
      clearTimeout(timer);
      if (!resolved) {
        testClient.end(true);
        resolve(true);
        resolved = true;
      }
    });
    
    testClient.on('error', () => {
      clearTimeout(timer);
      if (!resolved) {
        testClient.end(true);
        resolve(false);
        resolved = true;
      }
    });
  });
}
