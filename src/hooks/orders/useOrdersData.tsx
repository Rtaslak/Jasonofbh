import { useState, useEffect, useCallback } from "react";
import { useMqttConnection } from "@/context/mqtt/useMqttConnection";

import { type Order } from "@/types/orders";
import { toast } from "sonner";
import { apiClient } from "@/utils/api";

export function useOrdersData() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const { latestEvent, connectionStatus } = useMqttConnection();

  // 🔁 Generic fetch function (used by initial + manual + fallback)
  const fetchOrders = useCallback(() => {
    return apiClient
      .get<Order[]>("/orders")
      .then(setOrdersList)
      .catch((error) => {
        console.error("[ERROR] Failed to fetch orders:", error);
        toast.error("Failed to load orders from server");
      });
  }, []);

  // 🚀 Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ⚡️ Targeted in-memory update
  const updateSingleOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrdersList((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  }, []);

  // 📡 RFID Tag Processing (via MQTT)
  useEffect(() => {
    if (!latestEvent?.tagId) return;

    const tagId = latestEvent.tagId.toLowerCase();
    const match = ordersList.find(
      (order) => order.tagId?.toLowerCase() === tagId
    );

    if (match) {
      updateSingleOrder(match.id, {
        lastSeen: Date.now(),
        departmentStatus: match.departmentStatus,
        status: match.status,
      });
    }
  }, [latestEvent, ordersList, updateSingleOrder]);

  // 🌐 WebSocket Listener (order_updated)
  useEffect(() => {
    if (connectionStatus !== "connected") return;

    const socket = (window as any).socketInstance;
    if (!socket?.on) return;

    const handleOrderUpdate = (updatedOrder: Order) => {
      if (updatedOrder?.id) {
        updateSingleOrder(updatedOrder.id, updatedOrder);
      } else {
        // fallback full refresh
        fetchOrders();
      }
    };

    socket.on("order_updated", handleOrderUpdate);
    return () => socket.off("order_updated", handleOrderUpdate);
  }, [connectionStatus, updateSingleOrder, fetchOrders]);

  return {
    ordersList,
    setOrdersList,
    refreshOrders: fetchOrders,
    updateSingleOrder,
  };
}
