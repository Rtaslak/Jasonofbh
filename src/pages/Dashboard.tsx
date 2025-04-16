import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PenTool, Hammer, Gem, Star, CheckCircle, Truck } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import StationCard from "@/components/dashboard/StationCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDepartmentOrderCount } from "@/utils/orders/departmentManagement";
import { processRfidEvent } from "@/utils/orders/rfidEventProcessing";
import { checkAndRemoveExpiredTagReadings } from "@/utils/orders/tagTracking";
import { useMqtt } from "@/context/MqttContext";
import { toast } from "sonner";
import { departmentColors } from "@/utils/stationConstants";
import { TAG_EXPIRATION_CHECK_INTERVAL, BATCH_PROCESSING_INTERVAL } from "@/utils/orders/rfidConstants";

const departments = [
  { 
    id: 1, 
    name: "Designers", 
    color: departmentColors[1], // Use colors from stationConstants
    icon: <PenTool className="h-6 w-6" />,
    count: 0
  },
  { 
    id: 2, 
    name: "Jewelers", 
    color: departmentColors[2], // Use colors from stationConstants
    icon: <Hammer className="h-6 w-6" />,
    count: 0
  },
  { 
    id: 5, 
    name: "Diamond Counting", 
    color: departmentColors[5], // Use colors from stationConstants
    icon: <CheckCircle className="h-6 w-6" />,
    count: 0
  },
  { 
    id: 3, 
    name: "Setters", 
    color: departmentColors[3], // Use colors from stationConstants
    icon: <Gem className="h-6 w-6" />,
    count: 0
  },
  { 
    id: 4, 
    name: "Polisher", 
    color: departmentColors[4], // Use colors from stationConstants
    icon: <Star className="h-6 w-6" />,
    count: 0
  },
  {
    id: 6,
    name: "Shipping",
    color: departmentColors[6], // Use colors from stationConstants
    icon: <Truck className="h-6 w-6" />,
    count: 0
  }
];

const rfidEventQueue = [];
let processingQueue = false;

const processRfidEventBatch = () => {
  if (processingQueue || rfidEventQueue.length === 0) return;
  
  processingQueue = true;
  console.log(`Processing batch of ${rfidEventQueue.length} RFID events`);
  
  const batch = rfidEventQueue.splice(0, 10);
  
  batch.forEach(event => {
    if (event.tagId) {
      const readerId = event.readerId || 'default';
      processRfidEvent(event.tagId, readerId);
    }
  });
  
  window.dispatchEvent(new CustomEvent('orderUpdated'));
  
  processingQueue = false;
  
  if (rfidEventQueue.length > 0) {
    setTimeout(processRfidEventBatch, 100);
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentsWithCounts, setDepartmentsWithCounts] = useState(departments);
  const { latestEvent } = useMqtt();
  
  const updateDepartmentCounts = useCallback(() => {
    const updatedDepartments = departments.map(dept => ({
      ...dept,
      count: getDepartmentOrderCount(dept.id)
    }));
    
    setDepartmentsWithCounts(updatedDepartments);
  }, []);

  useEffect(() => {
    updateDepartmentCounts();
    
    const countsIntervalId = setInterval(updateDepartmentCounts, 2000);
    
    const expirationCheckIntervalId = setInterval(
      checkAndRemoveExpiredTagReadings, 
      TAG_EXPIRATION_CHECK_INTERVAL
    );
    
    const handleOrderUpdate = (event) => {
      updateDepartmentCounts();
      
      if (event.detail?.expired && event.detail?.metrics) {
        console.log(
          `[Tag Expiration Metrics] Last check: ${new Date(event.detail.metrics.lastCheckTime).toLocaleTimeString()}, ` +
          `Expired in last check: ${event.detail.metrics.expiredInLastCheck}, ` +
          `Total expired: ${event.detail.metrics.totalExpired}`
        );
      }
    };
    
    window.addEventListener('orderUpdated', handleOrderUpdate);
    
    checkAndRemoveExpiredTagReadings();
    
    return () => {
      clearInterval(countsIntervalId);
      clearInterval(expirationCheckIntervalId);
      window.removeEventListener('orderUpdated', handleOrderUpdate);
    }
  }, [updateDepartmentCounts]);

  useEffect(() => {
    if (latestEvent) {
      console.log('Received RFID event:', latestEvent);
      
      if (latestEvent.tagId) {
        rfidEventQueue.push(latestEvent);
        
        if (!processingQueue) {
          processRfidEventBatch();
        }
        
        if (rfidEventQueue.length <= 1) {
          toast.info(`RFID Tag Detected: ${latestEvent.tagId}`, {
            description: `Reader: ${latestEvent.readerId || 'default'}`,
          });
        }
      }
    }
  }, [latestEvent]);

  const handleDepartmentClick = (department: typeof departments[0]) => {
    console.log(`Navigating to department: ${department.name} (ID: ${department.id})`);
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
