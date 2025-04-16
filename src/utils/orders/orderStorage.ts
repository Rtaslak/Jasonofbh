
import { type Order } from "@/types/orders";

// Initialize with data from localStorage if available
export const loadOrdersFromLocalStorage = (): Order[] => {
  try {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      return JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error("Error loading orders from localStorage:", error);
  }
  return [];
};

// Save orders to localStorage
export const saveOrdersToLocalStorage = (): void => {
  try {
    const ordersWithoutDataUrls = orders.map(order => {
      // Create a deep copy without the dataUrls for storage efficiency
      const orderCopy = { ...order };
      if (orderCopy.images) {
        orderCopy.images = orderCopy.images.map(img => ({
          ...img,
          // Remove dataUrl from storage as it's large and can be regenerated
          dataUrl: undefined
        }));
      }
      return orderCopy;
    });
    
    localStorage.setItem('orders', JSON.stringify(ordersWithoutDataUrls));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

// Initialize with data from localStorage instead of empty array
export const orders: Order[] = loadOrdersFromLocalStorage();

// Function to get the next order number in sequence
export const getNextOrderNumber = (): string => {
  // Find the highest order number
  let highestNumber = 0;
  
  orders.forEach(order => {
    if (order.id.startsWith('ORD-')) {
      const numberPart = parseInt(order.id.substring(4), 10);
      if (!isNaN(numberPart) && numberPart > highestNumber) {
        highestNumber = numberPart;
      }
    }
  });
  
  // Increment by 1 and pad with zeros
  const nextNumber = highestNumber + 1;
  return `ORD-${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Get all orders
 */
export const getAllOrders = (): Order[] => {
  return orders;
};

/**
 * Update an order
 */
export const updateOrder = (updatedOrder: Order): void => {
  const index = orders.findIndex(order => order.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = { ...updatedOrder };
    saveOrdersToLocalStorage();
  }
};
