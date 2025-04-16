
import { User } from "lucide-react";
import StationCard from "@/components/dashboard/StationCard";
import { Station } from "@/types/stations";

interface StationsGridProps {
  stations: Station[];
  departmentColor: string;
  selectedStation: string | null;
  onStationSelect: (stationName: string) => void;
  departmentId?: number;
}

export default function StationsGrid({ 
  stations, 
  departmentColor, 
  selectedStation, 
  onStationSelect,
  departmentId
}: StationsGridProps) {
  if (stations.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground text-lg">No stations available in this department</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {stations.map((station, index) => (
        <StationCard
          key={index}
          name={station.name}
          icon={<User className="h-4 w-4" />}
          count={station.orderIds.length}
          color={departmentColor || "#1e293b"}
          onClick={() => onStationSelect(station.name)}
          selected={station.name === selectedStation}
          departmentId={departmentId}
          className="h-40"
        />
      ))}
    </div>
  );
}
