
const { logDebug } = require('../utils/logger');
const { departmentStations } = require('../models/departments');

/**
 * Emit order update through Socket.IO
 * @param {Object} io - Socket.IO instance
 * @param {Object} order - The order object
 * @param {Object} movementResult - Result from moveOrderToDepartment
 */
const emitOrderUpdate = (io, order, movementResult) => {
  if (!io) return;
  
  // Create a minimal update payload instead of sending the entire order
  const minimalUpdate = {
    id: order.id,
    tagId: order.tagId ? order.tagId.toLowerCase() : null,
    departmentId: movementResult.departmentId,
    departmentName: movementResult.departmentName,
    stationIndex: movementResult.stationIndex,
    departmentStatus: order.departmentStatus,
    lastSeen: order.lastSeen,
    status: order.status
  };
  
  logDebug(`📡 Emitting rfid/order_updated event for order ${order.id}`);
  
  // Broadcast the minimal update with namespaced events
  io.emit('rfid/order_updated', minimalUpdate);
  io.emit('rfid/departments_updated', departmentStations);
};

/**
 * Emit expired tag update through Socket.IO
 * @param {Object} io - Socket.IO instance
 * @param {Object} order - The order object
 */
const emitExpiredTagUpdate = (io, order) => {
  if (!io) return;
  
  // Create minimal update for expired tag
  const minimalUpdate = {
    id: order.id,
    departmentStatus: order.departmentStatus,
    lastSeen: undefined,
    expired: true
  };
  
  logDebug(`📡 Emitting expired tag update for order ${order.id}`);
  
  // Broadcast the minimal update with namespaced events
  io.emit('rfid/order_updated', minimalUpdate);
  io.emit('rfid/departments_updated', departmentStations);
};

module.exports = {
  emitOrderUpdate,
  emitExpiredTagUpdate
};
