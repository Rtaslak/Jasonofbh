
import { useState } from "react";
import { toast } from "sonner";
import { type Order } from "@/types/orders";

export function useOrderEditing(onSaveCallback?: (order: Order) => void) {
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const handleToggleEditMode = (orderId: string) => {
    setEditingOrderId(prevId => (prevId === orderId ? null : orderId));
  };

  const handleSaveEdit = (order: Order) => {
    if (!order) {
      console.error("No order provided to save");
      return;
    }
    
    try {
      console.log(`Saving edits for order ${order.id}`);
      
      // Update edit mode state
      setEditingOrderId(null);
      
      // Call save callback if provided
      if (onSaveCallback) {
        onSaveCallback(order);
      }
      
      toast.success(`Order ${order.id} updated successfully`);
    } catch (error) {
      console.error("Error saving order edit:", error);
      toast.error("Failed to save order changes");
    }
  };

  return {
    editingOrderId,
    handleToggleEditMode,
    handleSaveEdit
  };
}
