import { toast } from "sonner";
import { Order } from "@/types/orders";
import { orders } from "./orderStorage";
import { getDepartmentByReaderId } from "./departmentManagement";
import { TAG_RATE_LIMIT, EMIT_RATE_LIMIT } from "./rfidConstants";

interface MovementResult {
  success: boolean;
  previousDepartment?: number;
  newDepartment?: number;
  message?: string;
  unchanged?: boolean;
}

// Store last seen timestamps for rate limiting
const lastSeenTagTimestamps = new Map<string, number>();
// Map to track when we last emitted an update for an order
const lastEmittedUpdates = new Map<string, number>();

/**
 * Process an RFID event and update the order's department status
 * @param tagId The tag ID
 * @param readerId The reader ID
 * @returns Object with the result of the operation
 */
export const processRfidEvent = (
  tagId: string,
  readerId: string
): MovementResult => {
  console.log(`Processing RFID event: tag=${tagId}, reader=${readerId}`);
  
  // Normalize tag ID for consistent matching
  const normalizedTagId = tagId.toLowerCase();
  const normalizedReaderId = readerId.toLowerCase();
  
  // Create a location key that uniquely identifies this reader
  const locationKey = `${normalizedReaderId}`;
  
  // Rate limiting: Check if we've seen this tag at this location recently
  const lastSeen = lastSeenTagTimestamps.get(`${normalizedTagId}-${locationKey}`);
  const now = Date.now();
  
  if (lastSeen && (now - lastSeen < TAG_RATE_LIMIT)) {
    console.log(`Rate limiting tag ${normalizedTagId} at ${locationKey} (last seen ${now - lastSeen}ms ago)`);
    return { 
      success: true, 
      unchanged: true,
      message: "Rate limited: Tag seen too recently at this location" 
    };
  }
  
  // Find the order associated with this tag
  const order = orders.find(
    (order) => order.tagId && order.tagId.toLowerCase() === normalizedTagId
  );
  
  if (!order) {
    console.log(`No order found with tag ID: ${normalizedTagId}`);
    return { success: false, message: "No order found with this tag" };
  }
  
  // Get department for this reader
  const departmentId = getDepartmentByReaderId(normalizedReaderId);
  
  if (!departmentId) {
    console.log(`No department found for reader: ${normalizedReaderId}`);
    return { success: false, message: "Reader not associated with any department" };
  }
  
  // Initialize the department status if it doesn't exist
  if (!order.departmentStatus) {
    order.departmentStatus = {
      designers: false,
      jewelers: false,
      diamondCounting: false,
      setters: false,
      polisher: false,
      shipping: false,
    };
  }
  
  // Initialize transitions array if it doesn't exist
  if (!order.departmentTransitions) {
    order.departmentTransitions = [];
  }
  
  // Store current department for tracking changes
  const previousDepartmentId = (order as any).departmentId || 0;
  
  // Update the order with new department and timestamp
  order.lastSeen = now;
  (order as any).departmentId = departmentId;
  
  // Update department status based on department ID
  switch (departmentId) {
    case 1:
      order.departmentStatus.designers = true;
      break;
    case 2:
      order.departmentStatus.jewelers = true;
      break;
    case 3:
      order.departmentStatus.setters = true;
      break;
    case 4:
      order.departmentStatus.polisher = true;
      break;
    case 5:
      order.departmentStatus.diamondCounting = true;
      break;
    case 6:
      order.departmentStatus.shipping = true;
      break;
  }
  
  // Update the timestamp for this tag at this location
  lastSeenTagTimestamps.set(`${normalizedTagId}-${locationKey}`, now);
  
  // Check if department actually changed or if it's just a repeated scan
  if (previousDepartmentId !== departmentId) {
    // Department changed - log transition and show notification
    order.departmentTransitions.push({
      department: getDepartmentName(departmentId),
      timestamp: now,
    });
    
    // Check if we should emit a notification (rate limiting for UI)
    const lastEmitted = lastEmittedUpdates.get(order.id) || 0;
    if (now - lastEmitted >= EMIT_RATE_LIMIT) {
      // Show toast notification for department change
      toast.success(`Order ${order.id} moved to ${getDepartmentName(departmentId)}`);
      // Update last emitted timestamp
      lastEmittedUpdates.set(order.id, now);
    } else {
      console.log(`Suppressing notification for order ${order.id} (emitted too recently)`);
    }
    
    return {
      success: true,
      previousDepartment: previousDepartmentId,
      newDepartment: departmentId,
      message: `Order moved to ${getDepartmentName(departmentId)}`,
    };
  } else {
    // No actual department change, just update timestamp
    console.log(`Order ${order.id} already in ${getDepartmentName(departmentId)}, just updating timestamp`);
    return {
      success: true,
      unchanged: true,
      previousDepartment: previousDepartmentId,
      newDepartment: departmentId,
      message: `Order already in ${getDepartmentName(departmentId)}`,
    };
  }
};

// Helper function to get department name
function getDepartmentName(departmentId: number): string {
  switch (departmentId) {
    case 1: return "Designers";
    case 2: return "Jewelers";
    case 3: return "Setters";
    case 4: return "Polisher";
    case 5: return "Diamond Counting";
    case 6: return "Shipping";
    default: return "Unknown";
  }
}
