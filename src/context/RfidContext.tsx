
import React, { createContext, useContext } from 'react';
import { useRfidSocket, ConnectionStatus, RfidSocketEvent } from '../hooks/useRfidSocket';

// Context interface
interface RfidContextProps {
  connectionStatus: ConnectionStatus;
  latestEvent: RfidSocketEvent | null;
  connect: () => void;
  disconnect: () => void;
}

// Create context with default values
const RfidContext = createContext<RfidContextProps>({
  connectionStatus: 'disconnected',
  latestEvent: null,
  connect: () => {},
  disconnect: () => {}
});

interface RfidProviderProps {
  children: React.ReactNode;
}

export const RfidProvider: React.FC<RfidProviderProps> = ({ children }) => {
  const socketConnection = useRfidSocket();
  
  return (
    <RfidContext.Provider value={socketConnection}>
      {children}
    </RfidContext.Provider>
  );
};

export const useRfid = () => useContext(RfidContext);
export type { ConnectionStatus, RfidSocketEvent };
export default RfidContext;
