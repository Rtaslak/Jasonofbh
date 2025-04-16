
import { useState } from "react";
import { ColumnVisibility } from "../types/orderTypes";

export function useColumnVisibility() {
  // Default column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    orderId: true,
    customer: false,     // Changed default to false
    status: false,       // Changed default to false
    date: false,         // Keep as false
    dueDate: true,       // Changed default to true
    salesperson: false,  // Changed default to false
    items: false,
    tagId: false,
    actions: true
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };
  
  const getVisibleColumnsCount = () => {
    // Add 2 to account for checkbox column and pipeline column (which is always visible)
    return Object.values(columnVisibility).filter(Boolean).length + 2; 
  };

  return {
    columnVisibility,
    toggleColumn,
    getVisibleColumnsCount
  };
}
