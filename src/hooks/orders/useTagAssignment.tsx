
import { useState } from "react";
import { orders } from "@/utils/orders/orderStorage";
import { toast } from "sonner";
import { type Order } from "@/types/orders";

export function useTagAssignment(onOrderUpdated?: (orderId: string, updates: Partial<Order>) => void) {
  const [assigningTag, setAssigningTag] = useState(false);

  const handleAssignTag = async (orderId: string, tagId: string) => {
    try {
      setAssigningTag(true);
      
      // Find the order
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) {
        toast.error("Order not found");
        return false;
      }
      
      console.log(`Assigning tag ${tagId} to order ${orderId}`);
      
      // Remove tag from any other orders that might have it
      const normalizedTagId = tagId.toLowerCase();
      orders.forEach(order => {
        if (order.id !== orderId && order.tagId && order.tagId.toLowerCase() === normalizedTagId) {
          console.log(`Removing tag ${tagId} from order ${order.id}`);
          order.tagId = undefined;
        }
      });
      
      // Update the order with the tag
      orders[orderIndex].tagId = tagId;
      
      // If the order is new, change status to in-progress
      if (orders[orderIndex].status === 'new') {
        orders[orderIndex].status = 'in-progress';
      }
      
      toast.success(`Tag ${tagId} assigned to order ${orderId}`);
      
      // Use the targeted update function if provided
      if (onOrderUpdated) {
        onOrderUpdated(orderId, {
          tagId,
          status: orders[orderIndex].status,
        });
      }
      
      // Also dispatch a custom event for other listeners
      window.dispatchEvent(new CustomEvent('orderUpdated', { 
        detail: { 
          orderId: orderId,
          tagId: tagId
        }
      }));
      
      return true;
    } catch (error) {
      console.error("Error assigning tag:", error);
      toast.error("Failed to assign tag");
      return false;
    } finally {
      setAssigningTag(false);
    }
  };

  return {
    assigningTag,
    handleAssignTag
  };
}
