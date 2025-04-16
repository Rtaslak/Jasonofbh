import { apiClient } from '@/utils/api';
import { RfidReader } from './types';

/**
 * Get all RFID readers from the server
 */
export const getReaders = async (): Promise<RfidReader[]> => {
  try {
    return await apiClient.get<RfidReader[]>('/readers');
  } catch (error) {
    console.error('Error fetching readers:', error);
    throw new Error('Error fetching readers');
  }
};

/**
 * Map a reader to a department
 */
export const mapReaderToDepartment = async (
  socket: any, 
  readerId: string, 
  departmentId: number
): Promise<boolean> => {
  if (!socket) return false;
  
  try {
    socket.emit('map_reader_to_department', { readerId, departmentId });
    return true;
  } catch (error) {
    console.error('Error mapping reader to department:', error);
    return false;
  }
};

/**
 * Map an antenna to a station
 */
export const mapAntennaToStation = async (
  socket: any, 
  departmentId: number, 
  antennaNumber: string | number, 
  stationIndex: number
): Promise<boolean> => {
  const antennaStr = antennaNumber.toString();
  
  if (!socket) return false;
  
  try {
    socket.emit('map_antenna_to_station', { 
      departmentId, 
      antennaNumber: antennaStr, 
      stationIndex 
    });
    return true;
  } catch (error) {
    console.error('Error mapping antenna to station:', error);
    return false;
  }
};

/**
 * Get reader-to-department mappings from the server
 */
export const getReaderMappings = async (): Promise<Array<{readerId: string, departmentId: number}>> => {
  try {
    return await apiClient.get<Array<{readerId: string, departmentId: number}>>('/reader-mappings');
  } catch (error) {
    console.error('Error fetching reader mappings:', error);
    throw new Error('Error fetching reader mappings');
  }
};

/**
 * Get antenna-to-station mappings from the server
 */
export const getAntennaMappings = async (): Promise<Record<string, Record<string, number>>> => {
  try {
    return await apiClient.get<Record<string, Record<string, number>>>('/antenna-mappings');
  } catch (error) {
    console.error('Error fetching antenna mappings:', error);
    throw new Error('Error fetching antenna mappings');
  }
};
