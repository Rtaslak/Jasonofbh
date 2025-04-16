
import { toast } from 'sonner';
import { MqttConfig, ConnectionStatus, RfidEvent } from './types';
import { testMqttConnection } from './connection';
import mqttCore from './core/mqttCore';
import { connect, disconnect } from './connection/connectionHandler';

class MqttService {
  init(config?: Partial<MqttConfig>): void {
    if (config) {
      mqttCore.updateConfig(config);
    }

    connect();
  }

  connect(): void {
    connect();
  }

  disconnect(): void {
    disconnect();
  }

  getConnectionStatus(): ConnectionStatus {
    return mqttCore.getConnectionStatus();
  }

  onConnectionStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    return mqttCore.onConnectionStatusChange(callback);
  }

  onTagEvent(callback: (event: RfidEvent) => void): () => void {
    return mqttCore.onTagEvent(callback);
  }

  updateConfig(config: Partial<MqttConfig>): void {
    mqttCore.updateConfig(config);
    
    const client = mqttCore.getClient();
    if (client) {
      this.disconnect();
      this.connect();
    }
  }

  testConnection(config?: Partial<MqttConfig>): Promise<boolean> {
    const tempConfig = config 
      ? { ...mqttCore.getConfig(), ...config } 
      : mqttCore.getConfig();
    return testMqttConnection(tempConfig);
  }
}

export const mqttService = new MqttService();
export default mqttService;
