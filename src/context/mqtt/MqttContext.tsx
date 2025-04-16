import React, { createContext, useContext } from 'react';
import { MqttContextProps } from './types';
import { useMqttConnection } from './useMqttConnection';

// Create context with default values
const MqttContext = createContext<MqttContextProps>({
  connectionStatus: 'disconnected',
  latestEvent: null,
  connect: () => {},
  disconnect: () => {},
});

interface MqttProviderProps {
  children: React.ReactNode;
}

export const MqttProvider: React.FC<MqttProviderProps> = ({ children }) => {
  const mqttConnection = useMqttConnection();

  return (
    <MqttContext.Provider value={mqttConnection}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => useContext(MqttContext);
export type { ConnectionStatus } from './types';
export default MqttContext;
