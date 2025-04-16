
import { getServerUrl } from './configService';

// Assign a tag to an order
export const assignTagToOrder = (socket: any, orderId: string, tagId: string): Promise<{ success: boolean }> => {
  if (!socket) {
    console.error('Cannot assign tag: not connected');
    return Promise.reject(new Error('WebSocket connection not available'));
  }
  
  return new Promise<{ success: boolean }>((resolve, reject) => {
    try {
      console.log(`Emitting assign_tag event: orderId=${orderId}, tagId=${tagId}`);
      socket.emit('assign_tag', { orderId, tagId });
      
      // Listen for the result (one-time event)
      socket.once('tag_assignment_result', (result: { success: boolean, error?: string }) => {
        console.log('Received tag_assignment_result:', result);
        
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error || 'Tag assignment failed'));
        }
      });
      
      // Add a timeout just in case
      const timeoutId = setTimeout(() => {
        console.error('Tag assignment timed out after 5 seconds');
        reject(new Error('Tag assignment timed out'));
      }, 5000);
      
      // Clean up the timeout if we get a response
      socket.once('tag_assignment_result', () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error('Error in assignTagToOrder:', error);
      reject(error);
    }
  });
};

// Register a tag with a department
export const registerTagWithDepartment = (socket: any, tagId: string, departmentId: number): Promise<void> => {
  if (!socket) {
    console.error('Cannot register tag: not connected');
    return Promise.reject(new Error('Not connected'));
  }
  
  return new Promise<void>((resolve, reject) => {
    try {
      socket.emit('register_tag', { tagId, departmentId });
      
      // Listen for the result (one-time event)
      socket.once('tag_registration_result', (result: { success: boolean, error?: string }) => {
        console.log('Received tag_registration_result:', result);
        
        if (result.success) {
          resolve();
        } else {
          reject(new Error(result.error || 'Tag registration failed'));
        }
      });
      
      // Add a timeout just in case
      const timeoutId = setTimeout(() => {
        console.error('Tag registration timed out after 5 seconds');
        reject(new Error('Tag registration timed out'));
      }, 5000);
      
      // Clean up the timeout if we get a response
      socket.once('tag_registration_result', () => {
        clearTimeout(timeoutId);
      });
    } catch (error) {
      console.error('Error in registerTagWithDepartment:', error);
      reject(error);
    }
  });
};

// Get all tag mappings from the server
export const getTagMappings = (): Promise<any> => {
  const serverUrl = getServerUrl();
  
  return fetch(`${serverUrl}/api/tag-mappings`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
};

// Assign reader to Jewelers department with all antennas mapped to stations
export const assignReaderToJewelers = (socket: any, readerId: string): Promise<boolean> => {
  if (!socket) {
    console.error('Cannot assign reader: not connected');
    return Promise.reject(new Error('WebSocket connection not available'));
  }
  
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      // Step 1: Map the reader to Jewelers department (ID: 2)
      console.log(`Mapping reader ${readerId} to Jewelers department`);
      socket.emit('map_reader_to_department', { readerId, departmentId: 2 });
      
      // Step 2: Map antennas to jeweler stations
      const antennaStationMappings = [
        { antenna: "1", station: 0, name: "Roger" },
        { antenna: "2", station: 1, name: "Tro" },
        { antenna: "3", station: 2, name: "Vicken" },
        { antenna: "4", station: 3, name: "Simon" },
        { antenna: "5", station: 4, name: "Hratch" },
        { antenna: "6", station: 5, name: "Ara" },
        { antenna: "7", station: 6, name: "Hrant" },
        { antenna: "8", station: 8, name: "Engraving" }
      ];
      
      // Map each antenna
      for (const mapping of antennaStationMappings) {
        console.log(`Mapping antenna ${mapping.antenna} to ${mapping.name}`);
        socket.emit('map_antenna_to_station', {
          departmentId: 2,
          antennaNumber: mapping.antenna,
          stationIndex: mapping.station
        });
        
        // Small delay to ensure server processes each mapping
        await new Promise(r => setTimeout(r, 100));
      }
      
      resolve(true);
    } catch (error) {
      console.error('Error in assignReaderToJewelers:', error);
      reject(error);
    }
  });
};
