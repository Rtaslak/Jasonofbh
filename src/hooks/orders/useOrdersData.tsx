import { useState, useEffect, useCallback } from "react";
import { useMqtt } from "@/context/MqttContext";
import { type Order } from "@/types/orders";
import { toast } from "sonner";
import { apiClient } from "@/utils/api";

export function useOrdersData() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const { latestEvent, connectionStatus } = useMqtt();

  // Load orders from API initially
  useEffect(() => {
    console.log("[DEBUG] useOrdersData hook initialized");
    apiClient.get<Order[]>("/orders")
      .then((fetchedOrders) => {
        console.log("[DEBUG] Orders fetched:", fetchedOrders);
        setOrdersList(fetchedOrders);
      })
      .catch((error) => {
        console.error("[ERROR] Failed to fetch orders:", error);
        toast.error("Failed to load orders from server");
      });
  }, []);

  // Function to update a specific order without refreshing the whole list
  const updateSingleOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    console.log(`[DEBUG] Updating single order ${orderId} with:`, updates);

    setOrdersList(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, ...updates } : order
      )
    );
  }, []);

  // Handle RFID events with targeted updates
  useEffect(() => {
    if (!latestEvent || !latestEvent.tagId) return;

    const tagId = latestEvent.tagId.toLowerCase();

    const matchingOrder = ordersList.find(o => o.tagId?.toLowerCase() === tagId);
    if (matchingOrder) {
      console.log(`[DEBUG] Found order ${matchingOrder.id} with tag ${tagId}`);
      updateSingleOrder(matchingOrder.id, {
        lastSeen: Date.now(),
        departmentStatus: matchingOrder.departmentStatus,
        status: matchingOrder.status
      });
    }
  }, [latestEvent, ordersList, updateSingleOrder]);

  // Listen for order updates from the server via WebSocket
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const socket = (window as any).socketInstance;
    if (!socket) return;

    const handleOrderUpdate = (updatedOrderData: any) => {
      console.log("[DEBUG] WebSocket order_updated received:", updatedOrderData);

      if (updatedOrderData?.id) {
        updateSingleOrder(updatedOrderData.id, updatedOrderData);
      } else {
        // Fallback to full fetch
        apiClient.get<Order[]>("/orders")
          .then(fetchedOrders => setOrdersList(fetchedOrders))
          .catch(err => console.error("[ERROR] Refresh fallback failed:", err));
      }
    };

    socket.on('order_updated', handleOrderUpdate);
    return () => socket.off('order_updated', handleOrderUpdate);
  }, [connectionStatus, updateSingleOrder]);

  // Function to refresh orders list manually
  const refreshOrders = useCallback(() => {
    console.log("[DEBUG] Manually refreshing orders from server");
    apiClient.get<Order[]>("/orders")
      .then(fetchedOrders => setOrdersList(fetchedOrders))
      .catch(err => console.error("[ERROR] Failed to refresh orders:", err));
  }, []);

  return {
    ordersList,
    setOrdersList,
    refreshOrders,
    updateSingleOrder
  };
}
