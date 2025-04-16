
import { useState } from "react";

export function useOrderSelection() {
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // This function now returns the orderId and isSelected status, matching what OrderRow expects
  const handleSelectOrder = (orderId: string, isSelected: boolean) => {
    setSelectedOrders(prevSelected => {
      const newSelected = new Set(prevSelected);
      
      if (isSelected) {
        newSelected.add(orderId);
      } else {
        newSelected.delete(orderId);
      }
      
      return newSelected;
    });
  };

  const handleSelectAll = (checked: boolean, orderIds: string[]) => {
    if (checked) {
      setSelectedOrders(new Set(orderIds));
    } else {
      setSelectedOrders(new Set());
    }
  };

  return {
    selectedOrders,
    handleSelectOrder,
    handleSelectAll
  };
}
