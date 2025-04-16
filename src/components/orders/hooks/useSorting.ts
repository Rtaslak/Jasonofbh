
import { useState, useCallback } from "react";
import { SortConfig, SortField } from "../types/sortingTypes";
import { Order } from "@/types/orders";

export function useSorting(initialField: SortField = 'createdAt') {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: initialField,
    direction: 'desc'
  });

  const onSort = useCallback((field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const sortOrders = useCallback((orders: Order[]) => {
    return [...orders].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.field) {
        case 'orderId':
          return (a.id.localeCompare(b.id)) * direction;
        case 'customer':
          return (a.customer.localeCompare(b.customer)) * direction;
        case 'status':
          return (a.status.localeCompare(b.status)) * direction;
        case 'dueDate':
          if (!a.dueDate) return direction;
          if (!b.dueDate) return -direction;
          return (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * direction;
        case 'createdAt':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        default:
          return 0;
      }
    });
  }, [sortConfig]);

  return {
    sortConfig,
    onSort,
    sortOrders
  };
}
