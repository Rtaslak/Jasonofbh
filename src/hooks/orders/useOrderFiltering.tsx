
import { useState, useCallback } from "react";
import { Order } from "@/types/orders";

export function useOrderFiltering() {
  const [searchTerm, setSearchTerm] = useState("");
  // Change the default value to "all" instead of null to show all orders by default
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filterOrders = useCallback((orders: Order[]) => {
    // Add debug logging to help diagnose filtering issues
    console.log("[DEBUG] Filtering orders:", { 
      total: orders.length, 
      searchTerm, 
      statusFilter 
    });
    
    return orders.filter(order => {
      // Filter by search term if present
      const searchMatch = !searchTerm || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status if selected and not "all"
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      
      return searchMatch && statusMatch;
    });
  }, [searchTerm, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filterOrders
  };
}
