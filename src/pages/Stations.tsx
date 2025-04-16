
import PageTransition from "@/components/layout/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StationsGrid from "@/components/stations/StationsGrid";
import StationOrdersTable from "@/components/stations/StationOrdersTable";
import StationHeader from "@/components/stations/StationHeader";
import { useStationManagement } from "@/hooks/useStationManagement";

export default function Stations() {
  const {
    department,
    selectedStation,
    stationOrders,
    stations,
    showStationsUI,
    handleStationSelect,
    navigate
  } = useStationManagement();

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <StationHeader 
          department={department} 
          onBackClick={() => navigate("/")} 
        />
        
        {/* Stations Section - Only shown for departments that have stations */}
        {showStationsUI && (
          <Card>
            <CardHeader>
              <CardTitle>Stations</CardTitle>
            </CardHeader>
            <CardContent>
              <StationsGrid 
                stations={stations}
                departmentColor={department?.color || "#1e293b"}
                selectedStation={selectedStation}
                onStationSelect={handleStationSelect}
              />
            </CardContent>
          </Card>
        )}
        
        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              {showStationsUI 
                ? `Orders in ${selectedStation}` 
                : `All Orders in ${department?.name} Department`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StationOrdersTable stationOrders={stationOrders} />
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
