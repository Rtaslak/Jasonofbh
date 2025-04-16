
import { useState } from "react";
import { orders } from "@/utils/orders/orderStorage";
import { toast } from "sonner";
import { saveOrdersToLocalStorage } from "@/utils/orders/orderStorage";

export function useOrderDeletion(
  setOrdersList: (orders: any[]) => void,
  clearSelection: () => void,
  refreshOrders?: () => void
) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true);
      
      // Find the order
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        toast.error("Order not found");
        return;
      }
      
      // Remove the order
      orders.splice(orderIndex, 1);
      
      // Save changes to localStorage
      saveOrdersToLocalStorage();
      
      // Update UI
      setOrdersList([...orders]);
      
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async (selectedOrderIds: Set<string>) => {
    if (selectedOrderIds.size === 0) {
      toast.error("No orders selected");
      return;
    }
    
    try {
      setIsDeleting(true);
      
      // Convert Set to Array for easier processing
      const orderIdsToDelete = Array.from(selectedOrderIds);
      
      // Filter out the selected orders
      const remainingOrders = orders.filter(order => !orderIdsToDelete.includes(order.id));
      
      // Update the orders array
      orders.length = 0;
      orders.push(...remainingOrders);
      
      // Save changes to localStorage
      saveOrdersToLocalStorage();
      
      // Update UI
      setOrdersList([...orders]);
      
      // Clear selection
      clearSelection();
      
      toast.success(`${orderIdsToDelete.length} orders deleted successfully`);
      
      // Refresh UI
      if (refreshOrders) refreshOrders();
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error("Failed to delete orders");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    handleDeleteOrder,
    handleDeleteSelected
  };
}
