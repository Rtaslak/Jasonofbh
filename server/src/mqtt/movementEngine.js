
const { logDebug, logInfo } = require('../utils/logger');
const { departmentStations } = require('../models/departments');
const { orders, removeOrderFromAllDepartments, addOrderToDepartmentStation, updateOrderStatus } = require('../models/orders');
const { readerToDepartmentMap, antennaToStationMap } = require('../utils/mappers');

// Map department IDs to department names
const departmentNameMap = {
  1: "designers",
  2: "jewelers",
  3: "setters",
  4: "polisher", 
  5: "diamondCounting",
  6: "shipping"
};

/**
 * Get the department for this reader
 * @param {string} readerId - Reader ID
 * @param {string} antennaNumber - Antenna number
 * @returns {number} Department ID
 */
const getDepartmentForReader = (readerId, antennaNumber) => {
  // Normalize reader ID to lowercase
  const normalizedReaderId = readerId.toLowerCase();
  
  // Special case: Antenna 6 on Fx96006e8fB7 belongs to Polishers department
  if (normalizedReaderId === 'fx96006e8fb7' && antennaNumber === '6') {
    return 4; // Polishers department
  }
  
  // Get department from reader mapping or default to Jewelers (2)
  const departmentId = readerToDepartmentMap.get(normalizedReaderId) || readerToDepartmentMap.get('default');
  
  if (!departmentId) {
    logDebug(`❌ No department mapped for reader: ${normalizedReaderId}`);
    return 2; // Default to Jewelers
  }
  
  logDebug(`🔗 Mapped reader ${normalizedReaderId} to department ${departmentId}`);
  return departmentId;
};

/**
 * Get the station index based on the antenna number
 * @param {number} departmentId - Department ID
 * @param {string} antennaNumber - Antenna number
 * @returns {number} Station index
 */
const getStationForAntenna = (departmentId, antennaNumber) => {
  let stationIndex = 0; // Default to first station
  
  if (antennaNumber && antennaToStationMap[departmentId] && antennaToStationMap[departmentId][antennaNumber]) {
    stationIndex = antennaToStationMap[departmentId][antennaNumber];
    logDebug(`🔗 Mapped antenna ${antennaNumber} to station index ${stationIndex}`);
  } else {
    logDebug(`ℹ️ No station mapping found for department ${departmentId}, antenna ${antennaNumber}. Using default station 0.`);
  }
  
  return stationIndex;
};

/**
 * Initialize order's department status if not exists
 * @param {Object} order - The order object
 */
const initializeOrderDepartmentStatus = (order) => {
  if (!order.departmentStatus) {
    order.departmentStatus = {
      designers: false,
      jewelers: false,
      diamondCounting: false,
      setters: false,
      polisher: false,
      shipping: false
    };
  }
  
  if (!order.departmentTransitions) {
    order.departmentTransitions = [];
  }
};

/**
 * Move order to a specific department and station
 * @param {Object} order - The order object
 * @param {number} departmentId - Department ID
 * @param {string} antennaNumber - Antenna number
 * @returns {Object} Movement result with department name and station index
 */
const moveOrderToDepartment = (order, departmentId, antennaNumber) => {
  // Get department name from ID
  const departmentName = departmentNameMap[departmentId] || "jewelers";
  
  // Remove the order from all departments
  logDebug(`🔄 Removing order ${order.id} from all departments`);
  removeOrderFromAllDepartments(order.id);
  
  // Update department status - set current department to true, others to false
  Object.keys(order.departmentStatus).forEach(dept => {
    order.departmentStatus[dept] = dept === departmentName;
  });
  
  // Add department transition record
  order.departmentTransitions.push({
    department: departmentName,
    timestamp: Date.now()
  });
  
  // Get the station index based on the antenna number
  const stationIndex = getStationForAntenna(departmentId, antennaNumber);
  
  // Add to the appropriate department and station
  logDebug(`➕ Adding order ${order.id} to department ${departmentId}, station index ${stationIndex}`);
  addOrderToDepartmentStation(order.id, departmentId, stationIndex);
  
  // Update order status
  updateOrderStatus(order.id, departmentId);
  
  logInfo(`✅ Moved order ${order.id} to department ${departmentId}, station index ${stationIndex}`);
  
  return {
    departmentId,
    departmentName,
    stationIndex
  };
};

module.exports = {
  departmentNameMap,
  getDepartmentForReader,
  getStationForAntenna,
  initializeOrderDepartmentStatus,
  moveOrderToDepartment
};
