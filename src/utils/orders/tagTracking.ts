
import { orders } from "./orderStorage";
import { saveOrdersToLocalStorage } from "./orderStorage";
import { removeOrderFromAllDepartments } from "./departmentManagement";
import { TAG_TTL_DURATION } from "./rfidConstants";

// Store last seen reader/antenna for each tag to prevent duplicate processing
export const lastSeenTagLocations = new Map<string, string>();

// Store timestamps for each tag's last seen event
export const lastSeenTagTimestamps = new Map<string, number>();

// Metrics for tracking tag expirations
export const tagExpirationMetrics = {
  totalExpired: 0,
  lastCheckTime: 0,
  expiredInLastCheck: 0,
  expirationsByDepartment: new Map<string, number>()
};

// Function to check for expired tag readings and remove orders from departments
export const checkAndRemoveExpiredTagReadings = (): void => {
  const now = Date.now();
  let expiredTagsFound = 0;
  tagExpirationMetrics.lastCheckTime = now;
  
  // Find orders that have a lastSeen timestamp and haven't been seen recently
  orders.forEach(order => {
    if (order.lastSeen && (now - order.lastSeen) > TAG_TTL_DURATION) {
      console.log(`Order ${order.id} hasn't been seen for more than ${TAG_TTL_DURATION/1000} seconds, removing from departments`);
      
      // Track the department the tag was last seen in before removal
      const departmentId = (order as any).departmentId;
      if (departmentId) {
        const deptName = getDepartmentNameById(departmentId);
        const currentCount = tagExpirationMetrics.expirationsByDepartment.get(deptName) || 0;
        tagExpirationMetrics.expirationsByDepartment.set(deptName, currentCount + 1);
      }
      
      // Remove from all departments
      removeOrderFromAllDepartments(order.id);
      
      // Clear the lastSeen timestamp
      order.lastSeen = undefined;
      
      // Reset department status flags when tag is no longer detected
      if (order.departmentStatus) {
        Object.keys(order.departmentStatus).forEach(dept => {
          order.departmentStatus![dept as keyof typeof order.departmentStatus] = false;
        });
      }
      
      // Also clear from the last seen locations map
      if (order.tagId) {
        const tagId = order.tagId.toLowerCase();
        lastSeenTagLocations.delete(tagId);
        
        // Clear from the timestamps map too
        Array.from(lastSeenTagTimestamps.keys())
          .filter(key => key.startsWith(tagId))
          .forEach(key => lastSeenTagTimestamps.delete(key));
      }
      
      expiredTagsFound++;
      tagExpirationMetrics.totalExpired++;
    }
  });
  
  // Update metrics
  tagExpirationMetrics.expiredInLastCheck = expiredTagsFound;
  
  // Only save and dispatch event if we actually found expired tags
  if (expiredTagsFound > 0) {
    console.log(`[Metrics] Found ${expiredTagsFound} expired tags. Total expired: ${tagExpirationMetrics.totalExpired}`);
    
    // Save to localStorage
    saveOrdersToLocalStorage();
    
    // Force UI update
    window.dispatchEvent(new CustomEvent('orderUpdated', { 
      detail: { 
        expired: true,
        expiredCount: expiredTagsFound,
        metrics: tagExpirationMetrics
      } 
    }));
  }
};

// Helper function to get department name by ID
function getDepartmentNameById(departmentId: number): string {
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

// Check if a tag reading is a duplicate
export const isDuplicateReading = (tagId: string, locationKey: string): boolean => {
  const lastLocation = lastSeenTagLocations.get(tagId);
  const lastSeen = lastSeenTagTimestamps.get(`${tagId}-${locationKey}`);
  const now = Date.now();
  
  // Consider it a duplicate if:
  // 1. It's at the same location as last time AND
  // 2. It was seen less than 3 seconds ago
  if (lastLocation === locationKey && lastSeen && now - lastSeen < 3000) {
    console.log(`Duplicate reading for tag ${tagId} at ${locationKey}, seen ${now - lastSeen}ms ago`);
    return true;
  }
  
  return false;
};

// Update the last seen location for a tag
export const updateLastSeenLocation = (tagId: string, locationKey: string): void => {
  const now = Date.now();
  lastSeenTagLocations.set(tagId, locationKey);
  lastSeenTagTimestamps.set(`${tagId}-${locationKey}`, now);
};

// Get the last time a tag was seen
export const getTagLastSeenTime = (tagId: string, locationKey?: string): number | null => {
  if (locationKey) {
    return lastSeenTagTimestamps.get(`${tagId}-${locationKey}`) || null;
  }
  
  // Find any timestamp for this tag
  const key = Array.from(lastSeenTagTimestamps.keys())
    .find(k => k.startsWith(`${tagId}-`));
    
  return key ? lastSeenTagTimestamps.get(key) || null : null;
};

// Clear all cached data for a specific tag
export const clearTagCachedData = (tagId: string): void => {
  const normalizedTagId = tagId.toLowerCase();
  
  // Remove from locations map
  lastSeenTagLocations.delete(normalizedTagId);
  
  // Remove all entries from timestamps map
  Array.from(lastSeenTagTimestamps.keys())
    .filter(key => key.startsWith(normalizedTagId))
    .forEach(key => lastSeenTagTimestamps.delete(key));
    
  console.log(`Cleared cached data for tag ${normalizedTagId}`);
};
