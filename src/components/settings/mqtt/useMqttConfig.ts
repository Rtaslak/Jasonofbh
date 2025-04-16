
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useMqtt } from '@/context/MqttContext';
import { MqttConfig } from '@/services/rfid/types';
import rfidService from '@/services/rfid';

export function useMqttConfig() {
  const { connectionStatus, connect, disconnect } = useMqtt();
  const [isTesting, setIsTesting] = useState(false);
  
  // Initialize with default or stored config
  const [config, setConfig] = useState<MqttConfig>(() => {
    return {
      brokerUrl: localStorage.getItem('mqtt_broker_url') || 
                 import.meta.env.VITE_MQTT_BROKER_URL || 
                 'indigoalkali-lr5usy.a01.euc1.aws.hivemq.cloud',
      port: parseInt(localStorage.getItem('mqtt_port') || 
             import.meta.env.VITE_MQTT_PORT || 
             '8883'),
      username: localStorage.getItem('mqtt_username') || 
                import.meta.env.VITE_MQTT_USERNAME || 
                '',
      password: localStorage.getItem('mqtt_password') || 
                import.meta.env.VITE_MQTT_PASSWORD || 
                '',
      topicPrefix: localStorage.getItem('mqtt_topic_prefix') || 
                  import.meta.env.VITE_MQTT_TOPIC_PREFIX || 
                  'JBH/',
      useTls: localStorage.getItem('mqtt_use_tls') 
              ? localStorage.getItem('mqtt_use_tls') === 'true'
              : import.meta.env.VITE_MQTT_USE_TLS === 'true' || true,
      clientId: `jewelry-dashboard-${Math.random().toString(16).substring(2, 10)}`
    };
  });

  const handleChange = (field: keyof MqttConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = () => {
    // Store in localStorage for persistence
    localStorage.setItem('mqtt_broker_url', config.brokerUrl);
    localStorage.setItem('mqtt_port', config.port.toString());
    localStorage.setItem('mqtt_username', config.username);
    localStorage.setItem('mqtt_password', config.password);
    localStorage.setItem('mqtt_topic_prefix', config.topicPrefix);
    localStorage.setItem('mqtt_use_tls', config.useTls.toString());
    
    // Update service config and attempt to reconnect
    rfidService.updateMqttConfig(config);
    toast.success('MQTT connection configuration saved');
    
    // If we were previously connected, try to reconnect with new config
    if (connectionStatus === 'connected') {
      disconnect();
      setTimeout(() => {
        connect();
      }, 1000);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await rfidService.testConnection({
        brokerUrl: config.brokerUrl,
        port: config.port,
        username: config.username,
        password: config.password,
        clientId: `test-client-${Math.random().toString(16).substring(2, 10)}`,
        topicPrefix: config.topicPrefix,
        useTls: config.useTls
      });
      
      if (result.success) {
        toast.success('MQTT connection test successful');
      } else {
        toast.error('MQTT connection test failed');
      }
    } catch (error) {
      toast.error(`Test failed: ${(error as Error).message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const toggleConnection = () => {
    if (connectionStatus === 'connected') {
      disconnect();
    } else {
      // Store config in localStorage before connecting
      localStorage.setItem('mqtt_broker_url', config.brokerUrl);
      localStorage.setItem('mqtt_port', config.port.toString());
      localStorage.setItem('mqtt_username', config.username);
      localStorage.setItem('mqtt_password', config.password);
      localStorage.setItem('mqtt_topic_prefix', config.topicPrefix);
      localStorage.setItem('mqtt_use_tls', config.useTls.toString());
      
      // Update service config with form values
      rfidService.updateMqttConfig(config);
      
      // Attempt connection
      connect();
    }
  };

  return {
    config,
    connectionStatus,
    isTesting,
    handleChange,
    handleSaveConfig,
    handleTestConnection,
    toggleConnection
  };
}
