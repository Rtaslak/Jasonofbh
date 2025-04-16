
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Antenna, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { RfidReader } from '@/services/rfid/types';

// Department data
const departments = [
  { id: 1, name: "Designers" },
  { id: 2, name: "Jewelers" },
  { id: 3, name: "Setters" },
  { id: 4, name: "Polishers" },
  { id: 5, name: "Diamond Counting" },
  { id: 6, name: "Shipping" }
];

interface ReaderCardProps {
  reader: RfidReader;
  readerDepartment: number | null;
  onMapReaderToDepartment: (readerId: string, departmentId: string) => Promise<boolean | void>;
}

export default function ReaderCard({ 
  reader, 
  readerDepartment,
  onMapReaderToDepartment
}: ReaderCardProps) {
  const handleMapReaderToDepartment = async (departmentId: string) => {
    try {
      await onMapReaderToDepartment(reader.id, departmentId);
    } catch (error) {
      toast.error('Failed to map reader to department');
    }
  };

  // Calculate how long since the reader was last seen
  const getLastSeenText = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(seconds / 86400)} days ago`;
    }
  };

  return (
    <Card key={reader.id} className="overflow-hidden">
      <CardHeader className="p-4 bg-secondary/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {reader.status === 'online' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-lg">Reader {reader.id}</CardTitle>
            <Badge variant={reader.status === 'online' ? 'default' : 'secondary'}>
              {reader.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Last seen: {getLastSeenText(reader.lastSeen)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`reader-${reader.id}-department`}>Department</Label>
              <Select 
                value={readerDepartment?.toString() || ''} 
                onValueChange={handleMapReaderToDepartment}
              >
                <SelectTrigger id={`reader-${reader.id}-department`}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {Object.keys(reader.antennas).length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Antennas</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(reader.antennas).map((antenna) => (
                  <div 
                    key={antenna.number} 
                    className="p-2 rounded-md border flex items-center space-x-2"
                  >
                    <Antenna className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Antenna {antenna.number}</div>
                      <div className="text-xs text-muted-foreground">
                        Last active: {getLastSeenText(antenna.lastSeen)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-2">
              No antennas detected for this reader
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
