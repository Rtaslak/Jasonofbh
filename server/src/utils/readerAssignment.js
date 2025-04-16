
const { logDebug, logInfo } = require('./logger');
const { readerToDepartmentMap, antennaToStationMap } = require('./mappers');

// Automatically assign RG reader to Jewelers department
const autoAssignReaderToJewelers = (io) => {
  logInfo('Auto-assigning RG reader to Jewelers department');
  
  // Map the reader to Jewelers department (ID: 2)
  readerToDepartmentMap.set('RG', 2);
  
  // Set up antenna-to-station mappings if they don't exist
  if (!antennaToStationMap["2"]) {
    antennaToStationMap["2"] = {};
  }
  
  // Map antennas to jeweler stations
  const antennaStationMappings = [
    { antenna: "1", station: 0, name: "Roger" },
    { antenna: "2", station: 1, name: "Tro" },
    { antenna: "3", station: 2, name: "Vicken" },
    { antenna: "4", station: 3, name: "Simon" },
    { antenna: "5", station: 4, name: "Hratch" },
    { antenna: "6", station: 5, name: "Ara" },
    { antenna: "7", station: 6, name: "Hrant" },
    { antenna: "8", station: 7, name: "Tag Assignment Station" }
  ];
  
  // Set up each antenna mapping
  for (const mapping of antennaStationMappings) {
    antennaToStationMap["2"][mapping.antenna] = mapping.station;
    logDebug(`Mapped antenna ${mapping.antenna} to ${mapping.name}`);
  }
  
  // Emit update to all connected clients
  if (io) {
    io.emit('reader_mappings_updated', {
      reader: 'RG',
      department: 2,
      mappings: antennaStationMappings
    });
    
    logInfo('Notified clients of RG reader assignment to Jewelers');
  }
  
  return true;
};

module.exports = {
  autoAssignReaderToJewelers
};
