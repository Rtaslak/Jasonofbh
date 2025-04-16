
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import rfidService, { RfidReader } from '@/services/rfidService';
import { mapAntennaToStation } from '@/utils/readerUtils';

export function useReaderManagement() {
  const [readers, setReaders] = useState<RfidReader[]>([]);
  const [readerMappings, setReaderMappings] = useState<{readerId: string, departmentId: number}[]>([]);
  const [antennaMappings, setAntennaMappings] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('readers');

  useEffect(() => {
    console.log('[DEBUG] Setting up reader management listeners');
    
    const readersUnsubscribe = rfidService.onReadersUpdate((updatedReaders) => {
      console.log('[DEBUG] Readers update received:', updatedReaders);
      setReaders(updatedReaders);
    });

    const statusUnsubscribe = rfidService.onConnectionStatusChange((status) => {
      console.log('[DEBUG] RFID connection status changed:', status);
      if (status === 'connected') {
        loadData();
      }
    });

    loadData();

    return () => {
      console.log('[DEBUG] Cleaning up reader management listeners');
      readersUnsubscribe();
      statusUnsubscribe();
    };
  }, []);

  const loadData = async () => {
    console.log('[DEBUG] Loading reader management data');
    setIsLoading(true);
    try {
      const readersData = await rfidService.getReaders();
      console.log('[DEBUG] Fetched readers:', readersData);
      setReaders(readersData);
      
      const readerMappingsData = await rfidService.getReaderMappings();
      console.log('[DEBUG] Fetched reader mappings:', readerMappingsData);
      setReaderMappings(readerMappingsData);
      
      const antennaMappingsData = await rfidService.getAntennaMappings();
      console.log('[DEBUG] Fetched antenna mappings:', antennaMappingsData);
      setAntennaMappings(antennaMappingsData);

    } catch (error) {
      console.error('[ERROR] Failed to load reader data', error);
      toast.error('Failed to load reader data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapReaderToDepartment = async (readerId: string, departmentId: string) => {
    console.log(`[DEBUG] Mapping reader ${readerId} to department ${departmentId}`);
    try {
      await rfidService.mapReaderToDepartment(readerId, Number(departmentId));
      
      setReaderMappings(prev => {
        const existingIndex = prev.findIndex(m => m.readerId === readerId);
        if (existingIndex >= 0) {
          const newMappings = [...prev];
          newMappings[existingIndex] = { readerId, departmentId: Number(departmentId) };
          return newMappings;
        } else {
          return [...prev, { readerId, departmentId: Number(departmentId) }];
        }
      });
      
      console.log(`[DEBUG] Successfully mapped reader ${readerId} to department ${departmentId}`);
      return true;
    } catch (error) {
      console.error('[ERROR] Failed to map reader to department:', error);
      toast.error('Failed to map reader to department');
      return false;
    }
  };

  const handleMapAntennaToStation = async (
    departmentId: number, 
    readerId: string, 
    antennaNumber: string, 
    stationIndex: string
  ) => {
    console.log(`[DEBUG] Mapping antenna ${antennaNumber} of reader ${readerId} to station ${stationIndex} in department ${departmentId}`);
    
    const success = await mapAntennaToStation(
      rfidService, 
      departmentId, 
      readerId, 
      antennaNumber, 
      stationIndex
    );
    
    if (success) {
      const effectiveDepartmentId = (readerId === 'Fx96006e8fB7' && antennaNumber === '6') 
        ? 4  // Polisher department
        : departmentId;
      
      setAntennaMappings(prev => {
        const newMappings = { ...prev };
        if (!newMappings[effectiveDepartmentId]) {
          newMappings[effectiveDepartmentId] = {};
        }
        newMappings[effectiveDepartmentId][antennaNumber] = Number(stationIndex);
        console.log(`[DEBUG] Updated antenna mappings:`, newMappings);
        return newMappings;
      });
      console.log(`[DEBUG] Successfully mapped antenna ${antennaNumber} to station ${stationIndex}`);
    } else {
      console.error(`[ERROR] Failed to map antenna ${antennaNumber} to station ${stationIndex}`);
    }
    
    return success;
  };

  const getReaderDepartment = (readerId: string) => {
    const mapping = readerMappings.find(m => m.readerId === readerId);
    return mapping ? mapping.departmentId : null;
  };

  return {
    readers,
    readerMappings,
    antennaMappings,
    isLoading,
    activeTab,
    setActiveTab,
    getReaderDepartment,
    loadData,
    handleMapReaderToDepartment,
    handleMapAntennaToStation
  };
}
