import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMqttConnection } from "@/context/mqtt/useMqttConnection";

import { departmentColors, departmentsWithoutStations } from "@/utils/stationConstants";
import { Department, Station } from "@/types/stations";
import { useOrdersData } from "@/hooks/orders/useOrdersData";
import { useDepartmentData } from "@/utils/orders/departmentManagement";

export function useStationManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ordersList } = useOrdersData();
  const { latestEvent } = useMqttConnection();

  const { departments } = useDepartmentData();

  const [department, setDepartment] = useState<Department | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stationOrders, setStationOrders] = useState<any[]>([]);

  // Load department from URL + backend
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const deptId = Number(params.get("dept"));
    const deptName = params.get("name");
    const deptDesc = params.get("desc");

    if (!deptId || !deptName || departments.length === 0) return;

    const realDept = departments.find(d => d.id === deptId);

    if (!realDept) {
      console.warn(`[WARN] Department ID ${deptId} not found`);
      navigate("/");
      return;
    }

    const safeDept = realDept as Required<Department>;

    setDepartment({
      id: safeDept.id,
      name: deptName as string,
      description: deptDesc ?? safeDept.description ?? "Current items in department",
      color: departmentColors[safeDept.id] ?? "#1e293b",
      stations: safeDept.stations ?? [],
      orders: safeDept.orders ?? []
    });
  }, [location, navigate, departments]);

  const stations: Station[] = department?.stations || [];

  const refreshStationOrders = useCallback(() => {
    if (!department) return;

    const filtered = ordersList.filter((order) => {
      const matchesDept = (order as any).departmentId === department.id;
      const matchesStation = selectedStation ? order.station === selectedStation : true;
      return matchesDept && matchesStation;
    });

    setStationOrders(filtered);
  }, [ordersList, department, selectedStation]);

  const handleStationSelect = useCallback((stationName: string) => {
    setSelectedStation(stationName);

    const filtered = ordersList.filter(order =>
      (order as any).departmentId === department?.id &&
      order.station === stationName
    );

    setStationOrders(filtered);
  }, [ordersList, department]);

  useEffect(() => {
    refreshStationOrders();
    const intervalId = setInterval(refreshStationOrders, 1000);
    return () => clearInterval(intervalId);
  }, [refreshStationOrders]);

  useEffect(() => {
    if (latestEvent) {
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
