
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMqtt } from "@/context/MqttContext";
import { getStationOrders, departmentStations } from "@/utils/orders/departmentManagement";
import { departmentColors, departmentsWithoutStations } from "@/utils/stationConstants";
import { Department, Station, createDepartment, createStation } from "@/types/stations";

export function useStationManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stationOrders, setStationOrders] = useState<any[]>([]);
  const { latestEvent } = useMqtt();

  // Extract department info from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deptId = Number(params.get("dept"));
    const deptName = params.get("name");
    const deptDesc = params.get("desc");
    
    console.log(`[DEBUG] Station page - URL params: deptId=${deptId}, name=${deptName}`);
    
    if (deptId && deptName) {
      console.log(`[DEBUG] Setting current department: ${deptName} (ID: ${deptId})`);
      setDepartment(createDepartment(
        deptId,
        deptName,
        deptDesc || "Current items in department", 
        departmentColors[deptId] || "#1e293b",
        [],
        []
      ));
    } else {
      // If no department info in URL, go back to dashboard
      console.log(`[DEBUG] No department info found in URL, returning to dashboard`);
      navigate("/");
    }
  }, [location, navigate]);

  // Get the stations for this department
  const stations: Station[] = department ? 
    (departmentStations[department.id] || []).map(station => {
      // Ensure each station has all the required properties for Station type
      if (!("id" in station) || !("status" in station)) {
        return createStation(station.name, station.description, station.orderIds);
      }
      return station as Station;
    }) : [];

  // For departments without stations, get all orders from all stations in the department
  const getAllDepartmentOrders = useCallback((departmentId: number) => {
    if (!departmentStations[departmentId]) {
      console.log(`[DEBUG] Department ${departmentId} has no stations defined`);
      return [];
    }
    
    console.log(`[DEBUG] Getting all orders from department ${departmentId}`);
    
    const allOrders: any[] = [];
    departmentStations[departmentId].forEach(station => {
      const stationOrders = getStationOrders(station.orderIds);
      console.log(`[DEBUG] Found ${stationOrders.length} orders in station ${station.name}`);
      allOrders.push(...stationOrders);
    });
    
    // Remove duplicates if any
    const uniqueOrders = allOrders.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    );
    
    console.log(`[DEBUG] Total unique orders in department ${departmentId}: ${uniqueOrders.length}`);
    return uniqueOrders;
  }, []);

  // Refresh station orders
  const refreshStationOrders = useCallback(() => {
    if (!department) {
      console.log('[DEBUG] No department selected, cannot refresh station orders');
      return;
    }
    
    console.log(`[DEBUG] Refreshing orders for department ${department.id} (${department.name})`);
    
    if (departmentsWithoutStations.includes(department.id)) {
      // For special departments, get all orders
      console.log(`[DEBUG] Department ${department.name} doesn't use stations, getting all orders`);
      const allOrders = getAllDepartmentOrders(department.id);
      console.log(`[DEBUG] Found ${allOrders.length} orders in department ${department.name}`);
      setStationOrders(allOrders);
    } else if (selectedStation) {
      // For regular departments with selected station
      const station = stations.find(s => s.name === selectedStation);
      if (station) {
        console.log(`[DEBUG] Refreshing orders for station ${selectedStation}, found ${station.orderIds.length} order IDs`);
        const orders = getStationOrders(station.orderIds);
        console.log(`[DEBUG] Retrieved ${orders.length} full order objects for station ${selectedStation}`);
        setStationOrders(orders);
      } else {
        console.log(`[DEBUG] Selected station ${selectedStation} not found in department ${department.name}`);
        setStationOrders([]);
      }
    } else if (stations.length > 0) {
      // Default to first station if none selected
      console.log(`[DEBUG] No station selected, defaulting to ${stations[0].name}`);
      const orders = getStationOrders(stations[0].orderIds);
      setStationOrders(orders);
      setSelectedStation(stations[0].name);
    } else {
      console.log(`[DEBUG] Department ${department.name} has no stations defined`);
      setStationOrders([]);
    }
  }, [department, selectedStation, stations, getAllDepartmentOrders]);

  // Handle station selection
  const handleStationSelect = useCallback((stationName: string) => {
    console.log(`[DEBUG] Station selected: ${stationName}`);
    setSelectedStation(stationName);
    const station = stations.find(s => s.name === stationName);
    if (station) {
      console.log(`[DEBUG] Found station with ${station.orderIds.length} orders`);
      const orders = getStationOrders(station.orderIds);
      console.log(`[DEBUG] Retrieved ${orders.length} full orders for station ${stationName}`);
      setStationOrders(orders);
    } else {
      console.log(`[DEBUG] Station ${stationName} not found`);
      setStationOrders([]);
    }
  }, [stations]);

  // Initial load and refresh on station/department changes
  useEffect(() => {
    refreshStationOrders();
    
    // Set up periodic refresh
    const intervalId = setInterval(refreshStationOrders, 1000); // More frequent refresh
    
    return () => clearInterval(intervalId);
  }, [department, selectedStation, refreshStationOrders]);

  // Refresh immediately when RFID events occur
  useEffect(() => {
    if (latestEvent) {
      console.log("[DEBUG] RFID event detected, refreshing station orders:", latestEvent);
      refreshStationOrders();
    }
  }, [latestEvent, refreshStationOrders]);

  const showStationsUI = department && !departmentsWithoutStations.includes(department.id);

  return {
    department,
    selectedStation,
    stationOrders,
    stations,
    showStationsUI,
    handleStationSelect,
    navigate
  };
}
