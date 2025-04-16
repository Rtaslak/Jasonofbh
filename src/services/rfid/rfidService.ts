
import rfidCore from './core/rfidCore';
import { initService, connect, disconnect } from './core/connectionService';
import { updateMqttConfig, testConnection } from './configService';
import { assignTagToOrder, registerTagWithDepartment, getTagMappings } from './tagService';
import { mapReaderToDepartment, mapAntennaToStation, getReaders, getReaderMappings, getAntennaMappings } from './readerService';
import { getOrders } from './orderService';
import { 
  ConnectionStatus, 
  StatusChangeCallback, 
  TagEventCallback,
  OrderUpdateCallback,
  DepartmentUpdateCallback,
  ReadersUpdateCallback,
  RfidEvent,
  RfidReader,
  WebSocketConfig,
  MqttConfig
} from './types';

class RfidService {
  // Initialize the service
  init() {
    initService();
  }

  // Connection methods
  connect() {
    connect();
  }

  disconnect() {
    disconnect();
  }

  // Get the socket instance
  getSocket() {
    return rfidCore.getSocket();
  }

  // Event registration methods
  onConnectionStatusChange(callback: StatusChangeCallback) {
    return rfidCore.onConnectionStatusChange(callback);
  }

  onTagEvent(callback: TagEventCallback) {
    return rfidCore.onTagEvent(callback);
  }

  onOrderUpdate(callback: OrderUpdateCallback) {
    return rfidCore.onOrderUpdate(callback);
  }

  onDepartmentUpdate(callback: DepartmentUpdateCallback) {
    return rfidCore.onDepartmentUpdate(callback);
  }

  onReadersUpdate(callback: ReadersUpdateCallback) {
    return rfidCore.onReadersUpdate(callback);
  }

  // Configuration methods - Updated to use MqttConfig or WebSocketConfig as appropriate
  updateMqttConfig(config: MqttConfig | WebSocketConfig) {
    return updateMqttConfig(config);
  }

  testConnection(config: MqttConfig | WebSocketConfig) {
    return testConnection(config);
  }

  // Tag service methods
  assignTagToOrder(orderId: string, tagId: string) {
    return assignTagToOrder(this.getSocket(), orderId, tagId);
  }

  registerTagWithDepartment(tagId: string, departmentId: number) {
    return registerTagWithDepartment(this.getSocket(), tagId, departmentId);
  }

  // Reader service methods
  mapReaderToDepartment(readerId: string, departmentId: number) {
    return mapReaderToDepartment(this.getSocket(), readerId, departmentId);
  }

  mapAntennaToStation(departmentId: number, antennaNumber: string | number, stationIndex: number) {
    return mapAntennaToStation(this.getSocket(), departmentId, antennaNumber, stationIndex);
  }

  // Data fetching methods
  getOrders() {
    return getOrders();
  }

  getTagMappings() {
    return getTagMappings();
  }

  getReaders() {
    return getReaders();
  }

  getReaderMappings() {
    return getReaderMappings();
  }

  getAntennaMappings() {
    return getAntennaMappings();
  }
}

// Create and export a singleton instance
const rfidService = new RfidService();
export default rfidService;
