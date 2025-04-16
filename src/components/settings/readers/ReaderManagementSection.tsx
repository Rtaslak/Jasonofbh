
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useReaderManagement } from '@/hooks/useReaderManagement';
import ReaderTabs from './ReaderTabs';

export default function ReaderManagementSection() {
  const {
    readers,
    antennaMappings,
    isLoading,
    activeTab,
    setActiveTab,
    getReaderDepartment,
    loadData,
    handleMapReaderToDepartment,
    handleMapAntennaToStation
  } = useReaderManagement();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>RFID Reader Management</CardTitle>
          <CardDescription>
            Configure RFID readers and antenna mappings
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={loadData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <ReaderTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          readers={readers}
          getReaderDepartment={getReaderDepartment}
          onMapReaderToDepartment={handleMapReaderToDepartment}
          onMapAntennaToStation={handleMapAntennaToStation}
          antennaMappings={antennaMappings}
        />
      </CardContent>
    </Card>
  );
}
