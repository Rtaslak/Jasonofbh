
import { Socket } from 'socket.io-client';
import { 
  ConnectionStatus, 
  StatusChangeCallback, 
  TagEventCallback,
  OrderUpdateCallback,
  DepartmentUpdateCallback,
  ReadersUpdateCallback,
  RfidEvent,
  RfidReader
} from '../types';
import { getServerUrl } from '../configService';

class RfidCore {
  private socket: Socket | null = null;
  private statusCallbacks: StatusChangeCallback[] = [];
  private tagEventCallbacks: TagEventCallback[] = [];
  private orderUpdateCallbacks: OrderUpdateCallback[] = [];
  private departmentUpdateCallbacks: DepartmentUpdateCallback[] = [];
  private readersUpdateCallbacks: ReadersUpdateCallback[] = [];
  private connectionStatus: ConnectionStatus = 'disconnected';

  // Get the socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Set the socket instance
  setSocket(socket: Socket | null): void {
    this.socket = socket;
    
    if (socket) {
      // Store socket instance in window for direct access
      (window as any).socketInstance = socket;
    } else {
      (window as any).socketInstance = null;
    }
  }

  // Get server URL
  getServerUrl(): string {
    return getServerUrl();
  }

  // Handle connection status
  setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusCallbacks.forEach(callback => callback(status));
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Event registration methods
  onConnectionStatusChange(callback: StatusChangeCallback): () => void {
    this.statusCallbacks.push(callback);
    // Immediately notify of current status
    callback(this.connectionStatus);
    // Return a function to unsubscribe
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  onTagEvent(callback: TagEventCallback): () => void {
    this.tagEventCallbacks.push(callback);
    return () => {
      this.tagEventCallbacks = this.tagEventCallbacks.filter(cb => cb !== callback);
    };
  }

  onOrderUpdate(callback: OrderUpdateCallback): () => void {
    this.orderUpdateCallbacks.push(callback);
    return () => {
      this.orderUpdateCallbacks = this.orderUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  onDepartmentUpdate(callback: DepartmentUpdateCallback): () => void {
    this.departmentUpdateCallbacks.push(callback);
    return () => {
      this.departmentUpdateCallbacks = this.departmentUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  onReadersUpdate(callback: ReadersUpdateCallback): () => void {
    this.readersUpdateCallbacks.push(callback);
    return () => {
      this.readersUpdateCallbacks = this.readersUpdateCallbacks.filter(cb => cb !== callback);
    };
  }

  // Event notification methods
  notifyTagEvent(event: RfidEvent): void {
    this.tagEventCallbacks.forEach(callback => callback(event));
  }

  notifyOrderUpdate(order: any): void {
    this.orderUpdateCallbacks.forEach(callback => callback(order));
  }

  notifyDepartmentUpdate(departments: any): void {
    this.departmentUpdateCallbacks.forEach(callback => callback(departments));
  }

  notifyReadersUpdate(readers: RfidReader[]): void {
    this.readersUpdateCallbacks.forEach(callback => callback(readers));
  }
}

// Create and export a singleton instance
const rfidCore = new RfidCore();
export default rfidCore;
