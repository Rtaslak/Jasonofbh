import { MqttClient } from 'mqtt';
import { toast } from 'sonner';
import { MqttConfig, ConnectionStatus, RfidEvent } from '../types';
import { defaultConfig } from '../config';

class MqttCore {
  private client: MqttClient | null = null;
  private config: MqttConfig = defaultConfig;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private listeners: Array<(status: ConnectionStatus) => void> = [];
  private tagEventListeners: Array<(event: RfidEvent) => void> = [];
  private pingTimer: ReturnType<typeof setTimeout> | null = null;

  getClient(): MqttClient | null {
    return this.client;
  }

  setClient(client: MqttClient | null): void {
    this.client = client;
  }

  getConfig(): MqttConfig {
    return this.config;
  }

  updateConfig(config: Partial<MqttConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.notifyStatusListeners();
  }

  setupPingInterval(): void {
    // Clear any existing ping timer
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
    }
    
    // Setup a new ping timer to keep connection alive
    this.pingTimer = setInterval(() => {
      this.pingConnection();
    }, 30000); // Every 30 seconds
  }
  
  pingConnection(): void {
    if (this.client && this.client.connected) {
      // Publish a small ping message to keep the connection alive
      this.client.publish('rfid/ping', JSON.stringify({ 
        timestamp: Date.now(),
        clientId: this.config.clientId
      }), { qos: 0, retain: false });
      console.log('Ping sent to MQTT broker');
    }
  }

  clearPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  onConnectionStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.listeners.push(callback);
    
    callback(this.connectionStatus);
    
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  onTagEvent(callback: (event: RfidEvent) => void): () => void {
    this.tagEventListeners.push(callback);
    
    return () => {
      this.tagEventListeners = this.tagEventListeners.filter(cb => cb !== callback);
    };
  }

  notifyStatusListeners(): void {
    this.listeners.forEach(listener => {
      listener(this.connectionStatus);
    });
  }

  notifyTagEventListeners(event: RfidEvent): void {
    this.tagEventListeners.forEach(listener => {
      listener(event);
    });
  }
}

// Create and export a singleton instance
const mqttCore = new MqttCore();
export default mqttCore;
