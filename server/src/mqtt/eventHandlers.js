
const { logDebug, logError, logInfo } = require('../utils/logger');

// Track last notification time per error type to prevent spamming
const lastErrorNotification = new Map();
const ERROR_NOTIFICATION_COOLDOWN = 60000; // 1 minute cooldown between similar error notifications

// Setup connection-related event handlers
const setupConnectionHandlers = (client, io) => {
  console.log('[DEBUG] MQTT Events - Setting up event handlers');
  
  // Store the io instance in the client for future reference
  if (io) {
    client._socketIo = io;
  }
  
  client.on('connect', () => {
    console.log('[DEBUG] MQTT Events - Connected to broker');
    logInfo('Successfully connected to MQTT broker');
    
    // Notify all connected WebSocket clients
    if (client._socketIo) {
      client._socketIo.emit('mqtt_status', { 
        connected: true, 
        message: 'Connected to MQTT broker'
      });
    } else {
      console.log('[DEBUG] Socket.IO instance not available, cannot broadcast MQTT status');
    }
  });

  client.on('error', (err) => {
    console.log(`[DEBUG] MQTT Events - Error: ${err.message}`);
    console.log(`[DEBUG] MQTT Events - Error code: ${err.code || 'None'}`);
    
    logError('MQTT connection error:', err);
    
    // Get error type for deduplication
    const errorType = err.code || 'unknown';
    const now = Date.now();
    const lastNotification = lastErrorNotification.get(errorType) || 0;
    
    // Only notify clients if we haven't sent a similar notification recently
    if (now - lastNotification > ERROR_NOTIFICATION_COOLDOWN) {
      lastErrorNotification.set(errorType, now);
      
      // Check if Socket.IO is available
      if (!client._socketIo) {
        console.log('[DEBUG] Socket.IO instance not available, cannot broadcast MQTT error');
        return;
      }
      
      // Handle specific auth errors
      if (err.code === 5) {
        console.log('[DEBUG] MQTT Events - Authentication error detected');
        logError('Authentication failed. Please check your MQTT username and password.');
        logError(`Current connection details - Broker: ${client.options.hostname}, Username: ${client.options.username || 'none'}`);
        
        // Notify all connected WebSocket clients
        client._socketIo.emit('mqtt_error', { 
          message: 'MQTT authentication failed. Check your credentials.',
          code: 'AUTH_ERROR'
        });
        
        // Detailed guidance for debugging auth issues
        console.log('\n\n============= MQTT AUTH TROUBLESHOOTING =============');
        console.log('1. Check that username and password are correct');
        console.log('2. Verify MQTT user has proper permissions in HiveMQ Cloud console');
        console.log('3. Make sure the client ID is allowed');
        console.log('4. Check if you have connection limits that are being exceeded');
        console.log('5. Verify your HiveMQ Cloud plan is active');
        console.log('======================================================\n\n');
      } else if (err.code === 'ENOTFOUND') {
        console.log('[DEBUG] MQTT Events - DNS resolution error');
        logError(`DNS lookup failed for hostname: ${err.hostname}`);
        client._socketIo.emit('mqtt_error', { 
          message: `Cannot resolve MQTT broker hostname: ${err.hostname}`,
          code: 'DNS_ERROR'
        });
      } else if (err.code === 'ECONNRESET') {
        console.log('[DEBUG] MQTT Events - Connection reset error');
        logError('Connection reset by broker or network issue');
        client._socketIo.emit('mqtt_error', { 
          message: 'Connection reset - possible network issue',
          code: 'CONN_RESET'
        });
      } else if (err.message && err.message.includes('Keepalive timeout')) {
        console.log('[DEBUG] MQTT Events - Keepalive timeout error');
        logError('Keepalive timeout: The broker did not respond to keepalive packets');
        client._socketIo.emit('mqtt_error', { 
          message: 'Connection timed out - network issue detected',
          code: 'TIMEOUT'
        });
      } else {
        // Generic error
        client._socketIo.emit('mqtt_error', { 
          message: `MQTT error: ${err.message || 'Unknown error'}`,
          code: errorType
        });
      }
    }
  });

  client.on('close', () => {
    console.log('[DEBUG] MQTT Events - Connection closed');
    logInfo('MQTT connection closed');
    if (client._socketIo) {
      client._socketIo.emit('mqtt_status', { 
        connected: false, 
        message: 'Disconnected from MQTT broker'
      });
    }
  });

  client.on('reconnect', () => {
    console.log('[DEBUG] MQTT Events - Attempting to reconnect');
    logInfo('Attempting to reconnect to MQTT broker...');
    if (client._socketIo) {
      client._socketIo.emit('mqtt_status', { 
        connected: false, 
        message: 'Reconnecting to MQTT broker...'
      });
    }
  });

  client.on('offline', () => {
    console.log('[DEBUG] MQTT Events - Client is offline');
    logInfo('MQTT client is offline');
    if (client._socketIo) {
      client._socketIo.emit('mqtt_status', { 
        connected: false, 
        message: 'MQTT connection is offline'
      });
    }
  });

  client.on('disconnect', (packet) => {
    console.log('[DEBUG] MQTT Events - Broker requested disconnect');
    logInfo('MQTT broker requested disconnect', packet);
  });

  client.on('packetreceive', (packet) => {
    if (packet.cmd !== 'publish') { // Skip logging for regular messages
      console.log(`[DEBUG] MQTT Events - Packet received: ${packet.cmd}`);
      logDebug(`MQTT packet received: ${packet.cmd}`);
    }
  });
  
  // Handle the ping response to ensure keepalive is working
  client.on('pingresp', () => {
    console.log('[DEBUG] MQTT Events - Ping response received');
    logDebug('Received ping response from MQTT broker');
  });
};

module.exports = {
  setupConnectionHandlers
};
