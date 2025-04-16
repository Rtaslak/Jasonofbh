import { orders } from "./orderStorage";
import { saveOrdersToLocalStorage } from "./orderStorage";

// Update order status based on department
export const updateOrderStatus = (orderId: string, departmentId: number): void => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) return;
  
  // When order reaches shipping, mark as completed
  if (departmentId === 6) { // Shipping department
    orders[orderIndex].status = 'completed';
  } else {
    // Otherwise, it's in progress
    orders[orderIndex].status = 'in-progress';
  }
  
  // Save to localStorage after updating
  saveOrdersToLocalStorage();
};
