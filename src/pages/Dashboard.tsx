import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenTool, Hammer, Gem, Star, CheckCircle, Truck } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import StationCard from "@/components/dashboard/StationCard";
import { Input } from "@/components/ui/input";
import { processRfidEvent } from "@/utils/orders/rfidEventProcessing";
import { checkAndRemoveExpiredTagReadings } from "@/utils/orders/tagTracking";
import { useMqttConnection } from "@/context/mqtt/useMqttConnection";
import { toast } from "sonner";
import { departmentColors } from "@/utils/stationConstants";
import { TAG_EXPIRATION_CHECK_INTERVAL, BATCH_PROCESSING_INTERVAL } from "@/utils/orders/rfidConstants";
import { useOrdersData } from "@/hooks/orders/useOrdersData";

const departments = [
  { id: 1, name: "Designers", color: departmentColors[1], icon: <PenTool className="h-6 w-6" /> },
  { id: 2, name: "Jewelers", color: departmentColors[2], icon: <Hammer className="h-6 w-6" /> },
  { id: 5, name: "Diamond Counting", color: departmentColors[5], icon: <CheckCircle className="h-6 w-6" /> },
  { id: 3, name: "Setters", color: departmentColors[3], icon: <Gem className="h-6 w-6" /> },
  { id: 4, name: "Polisher", color: departmentColors[4], icon: <Star className="h-6 w-6" /> },
  { id: 6, name: "Shipping", color: departmentColors[6], icon: <Truck className="h-6 w-6" /> },
];

const rfidEventQueue = [];
let processingQueue = false;

const processRfidEventBatch = () => {
  if (processingQueue || rfidEventQueue.length === 0) return;
  processingQueue = true;

  const batch = rfidEventQueue.splice(0, 10);
  batch.forEach(event => {
    if (event.tagId) {
      const readerId = event.readerId || "default";
      processRfidEvent(event.tagId, readerId);
    }
  });

  window.dispatchEvent(new CustomEvent("orderUpdated"));
  processingQueue = false;

  if (rfidEventQueue.length > 0) {
    setTimeout(processRfidEventBatch, 100);
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { latestEvent } = useMqttConnection();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentsWithCounts, setDepartmentsWithCounts] = useState(departments);
  const { ordersList } = useOrdersData();

  const updateDepartmentCounts = useCallback(() => {
    const updated = departments.map(dept => {
      const count = ordersList.filter(order => (order as any).departmentId === dept.id).length;
      return { ...dept, count };
    });
    setDepartmentsWithCounts(updated);
  }, [ordersList]);

  useEffect(() => {
    updateDepartmentCounts();
    const intervalId = setInterval(updateDepartmentCounts, 2000);
    const expirationCheckIntervalId = setInterval(checkAndRemoveExpiredTagReadings, TAG_EXPIRATION_CHECK_INTERVAL);

    const handleOrderUpdate = () => updateDepartmentCounts();
    window.addEventListener("orderUpdated", handleOrderUpdate);

    checkAndRemoveExpiredTagReadings();

    return () => {
      clearInterval(intervalId);
      clearInterval(expirationCheckIntervalId);
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [updateDepartmentCounts]);

  useEffect(() => {
    if (latestEvent?.tagId) {
      rfidEventQueue.push(latestEvent);
      if (!processingQueue) processRfidEventBatch();
      if (rfidEventQueue.length <= 1) {
        toast.info(`RFID Tag Detected: ${latestEvent.tagId}`, {
          description: `Reader: ${latestEvent.readerId || 'default'}`
        });
      }
    }
  }, [latestEvent]);

  const handleDepartmentClick = (department: typeof departments[0]) => {
    navigate(`/stations?dept=${department.id}&name=${encodeURIComponent(department.name)}`);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex justify-end mb-2">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {departmentsWithCounts.map((department) => (
            <StationCard
              key={department.id}
              name={department.name}
              icon={department.icon}
              color={department.color}
              count={department.count}
              onClick={() => handleDepartmentClick(department)}
              departmentId={department.id}
              className="h-40"
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
