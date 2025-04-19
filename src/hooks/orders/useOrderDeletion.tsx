import { useState } from "react";
import { toast } from "sonner";
import { orderService } from "@/services/orderService";

export function useOrderDeletion(
  setOrdersList: (orders: any[]) => void,
  clearSelection: () => void,
  refreshOrders?: () => void
) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true);

      // Call real API to delete
      await orderService.deleteOrder(orderId);

      toast.success("Order deleted successfully");

      if (refreshOrders) {
        refreshOrders();
      }
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

      // Delete all selected orders via API
      const orderIdsToDelete = Array.from(selectedOrderIds);
      await Promise.all(orderIdsToDelete.map(id => orderService.deleteOrder(id)));

      toast.success(`${orderIdsToDelete.length} orders deleted successfully`);

      // Clear selection
      clearSelection();

      // Refresh UI
      if (refreshOrders) refreshOrders();
    } catch (error) {
      console.error("Error deleting selected orders:", error);
      toast.error("Failed to delete selected orders");
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
