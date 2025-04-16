
import { orders, saveOrdersToLocalStorage } from "./orderStorage";
import { removeOrderFromAllDepartments } from "./departmentManagement";

// Map of RFID tag IDs to department IDs
// This simulates the physical placement of RFID readers in each department
const tagToDepartmentMap = new Map<string, number>();

// Function to register a tag with a specific department
export const registerTagWithDepartment = (tagId: string, departmentId: number) => {
  console.log(`[DEBUG] Registering tag ${tagId} with department ${departmentId}`);
  // Always store tag IDs in lowercase for consistent comparison
  tagToDepartmentMap.set(tagId.toLowerCase(), departmentId);
};

// Initialize some example tag-to-department mappings
// In a real system, this would come from configuration or database
registerTagWithDepartment('tag001', 1); // Design department
registerTagWithDepartment('tag002', 2); // Jewelers department
registerTagWithDepartment('tag003', 3); // Setters department
registerTagWithDepartment('tag004', 4); // Polishers department
registerTagWithDepartment('tag005', 5); // Diamond Counting department
registerTagWithDepartment('tag006', 6); // Shipping department

// Function to assign a tag to an order and update its department location
export const assignTagToOrder = (orderId: string, tagId: string): boolean => {
  console.log(`[DEBUG] Attempting to assign tag ${tagId} to order ${orderId}`);
  
  // Normalize tag ID to lowercase for consistent comparison
  const normalizedTagId = tagId.toLowerCase();
  
  // Check if tag is already assigned to another order
  const existingOrder = orders.find(order => order.tagId && order.tagId.toLowerCase() === normalizedTagId);
  if (existingOrder && existingOrder.id !== orderId) {
    console.log(`[DEBUG] Tag ${normalizedTagId} is already assigned to order ${existingOrder.id}`);
    console.log(`[DEBUG] Will reassign from order ${existingOrder.id} to ${orderId}`);
    
    // Remove tag from existing order
    existingOrder.tagId = undefined;
  }
  
  // Find the order
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex === -1) {
    console.log(`[DEBUG] Cannot assign tag: Order ${orderId} not found`);
    return false;
  }
  
  console.log(`[DEBUG] Found order at index ${orderIndex}:`, orders[orderIndex]);
  
  // Assign the tag to the order (store in lowercase)
  orders[orderIndex].tagId = normalizedTagId;
  
  // Update order status based on tag assignment
  if (normalizedTagId) {
    // New orders with tags are automatically set to in-progress
    if (orders[orderIndex].status === 'new') {
      console.log(`[DEBUG] Updating order status from 'new' to 'in-progress'`);
      orders[orderIndex].status = 'in-progress';
    }
  }
  
  console.log(`[DEBUG] Successfully assigned tag ${normalizedTagId} to order ${orderId}`);
  console.log(`[DEBUG] Updated order:`, orders[orderIndex]);
  
  // Save to localStorage after updating the order
  saveOrdersToLocalStorage();
  
  // Force UI update by dispatching a custom event
  console.log(`[DEBUG] Dispatching orderUpdated event for order ${orderId}`);
  window.dispatchEvent(new CustomEvent('orderUpdated', { 
    detail: { 
      orderId: orderId, 
      tagId: normalizedTagId
    }
  }));
  
  return true;
};

// Export for use in other modules
export { tagToDepartmentMap };
