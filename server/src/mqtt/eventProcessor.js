
const { logDebug, logError, logInfo } = require('../utils/logger');
const { orders } = require('../models/orders');
const { saveOrdersToLocalStorage } = require('../models/orders');

// Import our new modules
const { 
  initializeOrderDepartmentStatus,
  moveOrderToDepartment,
  getDepartmentForReader
} = require('./movementEngine');

const {
  TAG_TTL_DURATION,
  initializeTagMapping,
  updateTagMapping,
  isDuplicateReading,
  updateLastSeenLocation,
  getOrderByTagId,
  clearTagLastSeenLocation
} = require('./tagMapping');

const { emitOrderUpdate, emitExpiredTagUpdate } = require('./socketEmitter');

// Initialize tag mapping on startup
initializeTagMapping();

/**
 * Process RFID event data
 * @param {Object} eventData - The parsed event data 
 * @param {Object} io - Socket.IO instance for emitting events
 */
const processRfidEvent = (eventData, io) => {
  // Extract tag information from event data
  const tagId = eventData.epc || eventData.tagId || eventData.id || 
                (eventData.data && eventData.data.idHex);
  
  if (!tagId) {
    logDebug('🚫 Received RFID event without tag ID');
    return;
  }
  
  const readerId = (eventData.readerId || eventData.reader || 
                   (eventData.data && eventData.data.hostName) || 'unknown');
  
  const antennaNumber = (eventData.antenna || 
                        (eventData.data && eventData.data.antenna) || '0');
  
  // Process the event using existing logic
  processTagScan(tagId, readerId, antennaNumber, io);
};

/**
 * Process tag scan to update order location in departments and stations
 * @param {string} tagId - Tag ID
 * @param {string} readerId - Reader ID
 * @param {string} antennaNumber - Antenna number
 * @param {Object} io - Socket.IO instance
 */
const processTagScan = (tagId, readerId, antennaNumber, io) => {
  // Normalize tag ID and reader ID to lowercase
  const normalizedTagId = tagId.toLowerCase();
  const normalizedReaderId = readerId.toLowerCase();
  
  logDebug(`🏷️ Processing RFID event - Tag: ${normalizedTagId}, Reader: ${normalizedReaderId}, Antenna: ${antennaNumber}`);
  
  // Get the order associated with this tag
  const order = getOrderByTagId(normalizedTagId);
  if (!order) {
    logDebug(`🔍 No order found with tag: ${normalizedTagId}`);
    return;
  }
  
  // Get the department for this reader
  const departmentId = getDepartmentForReader(normalizedReaderId, antennaNumber);
  
  // Update order timestamp
  order.updatedAt = new Date().toISOString();
  
  // Add lastSeen timestamp for TTL tracking
  order.lastSeen = Date.now();
  
  // Initialize department status if needed
  initializeOrderDepartmentStatus(order);
  
  // Check if this is a duplicate reading from the same antenna
  const locationKey = `${normalizedReaderId}-${antennaNumber}`;
  
  if (isDuplicateReading(normalizedTagId, locationKey)) {
    logDebug(`🔄 Ignoring duplicate reading of tag ${normalizedTagId} at ${locationKey}`);
    
    // Still update the timestamp to prevent TTL expiration
    order.lastSeen = Date.now();
    return;
  }
  
  // Store the current location for future duplicate detection
  updateLastSeenLocation(normalizedTagId, locationKey);
  
  logDebug(`✅ Found order ${order.id} with tag ${normalizedTagId}`);
  
  // Move order to the appropriate department and station
  const movementResult = moveOrderToDepartment(order, departmentId, antennaNumber);
  
  // Emit updates via WebSocket
  emitOrderUpdate(io, order, movementResult);
  
  // Save to localStorage
  saveOrdersToLocalStorage();
};

/**
 * Check for and remove expired tag readings
 * @param {Object} io - Socket.IO instance
 */
const checkAndRemoveExpiredTagReadings = (io) => {
  const now = Date.now();
  
  // Find orders that have a lastSeen timestamp and haven't been seen recently
  orders.forEach(order => {
    if (order.lastSeen && (now - order.lastSeen) > TAG_TTL_DURATION) {
      logDebug(`⏱️ Order ${order.id} hasn't been seen for more than ${TAG_TTL_DURATION/1000} seconds, removing from departments`);
      
      // Remove from all departments
      removeOrderFromAllDepartments(order.id);
      
      // Clear the lastSeen timestamp
      order.lastSeen = undefined;
      
      // Reset department status flags when tag is no longer detected
      if (order.departmentStatus) {
        Object.keys(order.departmentStatus).forEach(dept => {
          order.departmentStatus[dept] = false;
        });
      }
      
      // Also clear from the last seen locations map
      if (order.tagId) {
        clearTagLastSeenLocation(order.tagId.toLowerCase());
      }
      
      // Emit updates via WebSocket
      emitExpiredTagUpdate(io, order);
    }
  });
};

module.exports = {
  processRfidEvent,
  processTagScan,
  checkAndRemoveExpiredTagReadings,
  updateTagMapping,
  initializeTagMapping
};
