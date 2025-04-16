
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RfidReader } from '@/services/rfid/types';
import EmptyReaderState from './EmptyReaderState';
import ReaderCard from './ReaderCard';
import AntennaMapping from './AntennaMapping';

interface ReaderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  readers: RfidReader[];
  getReaderDepartment: (readerId: string) => number | null;
  onMapReaderToDepartment: (readerId: string, departmentId: string) => Promise<boolean | void>;
  onMapAntennaToStation: (departmentId: number, readerId: string, antennaNumber: string, stationIndex: string) => Promise<boolean | void>;
  antennaMappings: Record<string, Record<string, number>>;
}

export default function ReaderTabs({
  activeTab,
  setActiveTab,
  readers,
  getReaderDepartment,
  onMapReaderToDepartment,
  onMapAntennaToStation,
  antennaMappings
}: ReaderTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="readers">Readers</TabsTrigger>
        <TabsTrigger value="antennas">Antenna Mapping</TabsTrigger>
      </TabsList>
      
      <TabsContent value="readers">
        {readers.length > 0 ? (
          <div className="space-y-6">
            {readers.map((reader) => (
              <ReaderCard
                key={reader.id}
                reader={reader}
                readerDepartment={getReaderDepartment(reader.id)}
                onMapReaderToDepartment={onMapReaderToDepartment}
              />
            ))}
          </div>
        ) : (
          <EmptyReaderState type="readers" />
        )}
      </TabsContent>
      
      <TabsContent value="antennas">
        {readers.length > 0 ? (
          <div className="space-y-6">
            {readers.map((reader) => {
              const departmentId = getReaderDepartment(reader.id);
              
              if (!departmentId) {
                return null; // Skip readers not assigned to a department
              }
              
              return (
                <AntennaMapping
                  key={`antenna-${reader.id}`}
                  reader={reader}
                  departmentId={departmentId}
                  antennaMappings={antennaMappings}
                  onMapAntennaToStation={onMapAntennaToStation}
                />
              );
            })}
          </div>
        ) : (
          <EmptyReaderState type="antennas" />
        )}
      </TabsContent>
    </Tabs>
  );
}
