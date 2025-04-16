
import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Antenna } from 'lucide-react';
import { RfidReader } from '@/services/rfid/types';
import { departments, getDepartmentStations, getAllDepartmentStations } from '@/utils/readerUtils';

interface AntennaMappingProps {
  reader: RfidReader;
  departmentId: number;
  antennaMappings: Record<string, Record<string, number>>;
  onMapAntennaToStation: (departmentId: number, readerId: string, antennaNumber: string, stationIndex: string) => Promise<boolean | void>;
}

export default function AntennaMapping({ 
  reader, 
  departmentId, 
  antennaMappings,
  onMapAntennaToStation
}: AntennaMappingProps) {
  // Special case: Antenna 6 on the setters reader (Fx96006e8fB7) can map to Polishers
  const shouldShowSpecialCase = reader.id === 'Fx96006e8fB7';
  
  return (
    <Card key={`antenna-${reader.id}`} className="overflow-hidden">
      <CardHeader className="p-4 bg-secondary/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Antenna className="h-4 w-4" />
            <CardTitle className="text-lg">
              Reader {reader.id} - {departments.find(d => d.id === departmentId)?.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(reader.antennas).map((antenna) => {
              // For antenna 6 on the setters reader, we'll show all departments' stations
              const isSpecialAntenna = shouldShowSpecialCase && antenna.number === 6;
              // Use the special stations list for antenna 6 on setters reader, otherwise use regular department stations
              const departmentStations = isSpecialAntenna 
                ? getDepartmentStations(4) // Polisher department stations
                : getDepartmentStations(departmentId);
              
              // For the special antenna, we need to check the polisher department mappings
              const mappingDeptId = isSpecialAntenna ? 4 : departmentId;
              const mappingValue = antennaMappings[mappingDeptId]?.[antenna.number]?.toString() || '';

              return (
                <div key={antenna.number} className="p-3 border rounded-md space-y-2">
                  <div className="font-medium flex items-center space-x-2">
                    <Antenna className="h-4 w-4 text-muted-foreground" />
                    <span>Antenna {antenna.number}</span>
                    {isSpecialAntenna && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Maps to Polisher
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`reader-${reader.id}-antenna-${antenna.number}`}>
                      Assigned Station
                    </Label>
                    <Select 
                      value={mappingValue}
                      onValueChange={(value) => 
                        onMapAntennaToStation(
                          isSpecialAntenna ? 4 : departmentId, 
                          reader.id, 
                          antenna.number.toString(), 
                          value
                        )
                      }
                    >
                      <SelectTrigger id={`reader-${reader.id}-antenna-${antenna.number}`}>
                        <SelectValue placeholder="Select station" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentStations.map((station, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
