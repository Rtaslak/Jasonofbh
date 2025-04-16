
// Map RFID reader to department
const readerToDepartmentMap = new Map();

// Default department mapping for readers
readerToDepartmentMap.set('FX96006e8f12', 2);  // Jewelers department - identified by hostname
readerToDepartmentMap.set('Fx96006e8fB7', 3);  // Setters department - identified by hostname
readerToDepartmentMap.set('FX96006e906c', 1);  // Designers department - identified by hostname
readerToDepartmentMap.set('RG', 2);  // Default RG reader to Jewelers department
readerToDepartmentMap.set('default', 2);  // Fallback to Jewelers department

// Map antenna number to station
const antennaToStationMap = {
  // Department 2 (Jewelers) antenna mappings
  "2": {
    "1": 0, // Antenna 1 -> Roger (index 0)
    "2": 1, // Antenna 2 -> Tro (index 1)
    "3": 2, // Antenna 3 -> Vicken (index 2)
    "4": 3, // Antenna 4 -> Simon (index 3)
    "5": 4, // Antenna 5 -> Hratch (index 4)
    "6": 5, // Antenna 6 -> Ara (index 5)
    "7": 6, // Antenna 7 -> Hrant (index 6)
    "8": 8, // Antenna 8 -> Engraving (index 8)
  },
  // Department 3 (Setters) antenna mappings
  "3": {
    "1": 3, // Antenna 1 -> Steve Tch (index 3)
    "2": 4, // Antenna 2 -> Steve (index 4)
    "3": 2, // Antenna 3 -> Hovig (index 2)
    "4": 1, // Antenna 4 -> Paolo (index 1)
    "5": 0, // Antenna 5 -> Sako (index 0)
  },
  // Special case: Antenna 6 of Setters reader maps to Polishers department
  "4": {
    "6": 0, // Antenna 6 -> Polisher (index 0)
  }
  // Add other departments as needed
};

// Special case mappings for specific reader-antenna combinations
// This will be checked before using the regular department mappings
const specialCaseMappings = [
  {
    readerId: 'fx96006e8fb7', // Setters reader (lowercase for comparison)
    antennaNumber: '6',
    targetDepartmentId: 4, // Maps to Polishers department
    targetStationIndex: 0  // Maps to station index 0 in Polishers
  },
  {
    readerId: 'fx96006e906c', // Designers reader (lowercase for comparison)
    antennaNumber: '6',
    targetDepartmentId: 2, // Maps to Jewelers department
    targetStationIndex: 7  // Maps to Ardziv (index 7) in Jewelers
  }
];

// Map of RFID tag IDs to department IDs
const tagToDepartmentMap = new Map();

// Initialize with some default mappings
tagToDepartmentMap.set('tag001', 1); // Design department
tagToDepartmentMap.set('tag002', 2); // Jewelers department
tagToDepartmentMap.set('tag003', 3); // Setters department
tagToDepartmentMap.set('tag004', 4); // Polishers department
tagToDepartmentMap.set('tag005', 5); // Diamond Counting department
tagToDepartmentMap.set('tag006', 6); // Shipping department

// Function to register a tag with a specific department
const registerTagWithDepartment = (tagId, departmentId) => {
  tagToDepartmentMap.set(tagId, departmentId);
  return true;
};

// Function to clear a tag mapping
const clearTagMapping = (tagId) => {
  if (tagToDepartmentMap.has(tagId)) {
    tagToDepartmentMap.delete(tagId);
    return true;
  }
  return false;
};

// Function to update reader to department mapping
const updateReaderToDepartment = (readerId, departmentId) => {
  readerToDepartmentMap.set(readerId, departmentId);
  return true;
};

// Function to update antenna to station mapping
const updateAntennaToStation = (departmentId, antennaNumber, stationIndex) => {
  if (!antennaToStationMap[departmentId]) {
    antennaToStationMap[departmentId] = {};
  }
  antennaToStationMap[departmentId][antennaNumber] = stationIndex;
  return true;
};

// Function to check for special case mappings
const getSpecialCaseMapping = (readerId, antennaNumber) => {
  // Normalize readerId to lowercase for consistent comparison
  const normalizedReaderId = readerId.toLowerCase();
  
  return specialCaseMappings.find(
    mapping => mapping.readerId === normalizedReaderId && mapping.antennaNumber === antennaNumber
  );
};

module.exports = {
  readerToDepartmentMap,
  antennaToStationMap,
  tagToDepartmentMap,
  specialCaseMappings,
  registerTagWithDepartment,
  clearTagMapping,
  updateReaderToDepartment,
  updateAntennaToStation,
  getSpecialCaseMapping
};
