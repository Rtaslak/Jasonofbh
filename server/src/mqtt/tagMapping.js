
const { logDebug, logInfo, logError } = require('../utils/logger');
const { orders } = require('../models/orders');

// TTL duration in milliseconds (1 minute)
const TAG_TTL_DURATION = 60000;

// Store last seen reader/antenna for each tag to prevent duplicate processing
const lastSeenTagLocations = new Map();

// Create a fast lookup map for tag IDs to order objects
const tagToOrderMap = new Map();

/**
 * Initialize the tag-to-order mapping
 */
const initializeTagMapping = () => {
  // Clear the existing map
  tagToOrderMap.clear();
  
  // Populate the map with all orders that have tags
  orders.forEach(order => {
    if (order.tagId) {
      tagToOrderMap.set(order.tagId.toLowerCase(), order);
      logDebug(`Mapped tag ${order.tagId} to order ${order.id}`);
    }
  });
  
  logInfo(`✅ Tag-to-order mapping initialized with ${tagToOrderMap.size} entries`);
};

/**
 * Update the tag mapping when a tag is assigned to an order
 * @param {string} orderId - Order ID
 * @param {string} tagId - Tag ID
 */
const updateTagMapping = (orderId, tagId) => {
  if (!tagId) {
    // Find and remove any existing mapping for this order
    for (const [key, order] of tagToOrderMap.entries()) {
      if (order.id === orderId) {
        tagToOrderMap.delete(key);
        logDebug(`🗑️ Removed mapping for tag ${key} from order ${orderId}`);
        break;
      }
    }
    return;
  }
  
  // Normalize tag ID
  const normalizedTagId = tagId.toLowerCase();
  
  // Get the order
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    logError(`❌ Cannot update tag mapping: Order ${orderId} not found`);
    return;
  }
  
  // Update the mapping
  tagToOrderMap.set(normalizedTagId, order);
  logDebug(`✅ Updated mapping for tag ${normalizedTagId} to order ${orderId}`);
};

/**
 * Check if this is a duplicate reading from the same antenna
 * @param {string} tagId - The tag ID
 * @param {string} locationKey - The location key (readerId-antennaNumber)
 * @returns {boolean} True if it's a duplicate reading
 */
const isDuplicateReading = (tagId, locationKey) => {
  const lastLocation = lastSeenTagLocations.get(tagId);
  const isDuplicate = lastLocation === locationKey;
  
  // Add debug logging for duplicate events (optional)
  if (isDuplicate) {
    logDebug(`🔄 Duplicate reading detected for tag ${tagId} at ${locationKey}`);
  }
  
  return isDuplicate;
};

/**
 * Update the last seen location for a tag
 * @param {string} tagId - The tag ID
 * @param {string} locationKey - The location key (readerId-antennaNumber)
 */
const updateLastSeenLocation = (tagId, locationKey) => {
  lastSeenTagLocations.set(tagId, locationKey);
};

/**
 * Get order by tag ID
 * @param {string} tagId - Tag ID
 * @returns {Object|null} The order or null if not found
 */
const getOrderByTagId = (tagId) => {
  const normalizedTagId = tagId.toLowerCase();
  return tagToOrderMap.get(normalizedTagId) || null;
};

/**
 * Clear tag's last seen location
 * @param {string} tagId - Tag ID
 */
const clearTagLastSeenLocation = (tagId) => {
  lastSeenTagLocations.delete(tagId);
};

module.exports = {
  TAG_TTL_DURATION,
  initializeTagMapping,
  updateTagMapping,
  isDuplicateReading,
  updateLastSeenLocation,
  getOrderByTagId,
  clearTagLastSeenLocation
};
