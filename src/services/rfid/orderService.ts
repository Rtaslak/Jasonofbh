
import { getServerUrl } from './configService';

// Get all orders from the server
export const getOrders = (): Promise<any> => {
  const serverUrl = getServerUrl();
  
  return fetch(`${serverUrl}/api/orders`)
    .then(response => response.json());
};
