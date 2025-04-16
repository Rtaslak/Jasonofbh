
const { readerToDepartmentMap, antennaToStationMap, tagToDepartmentMap, clearTagMapping, updateReaderToDepartment, updateAntennaToStation } = require('../utils/mappers');

module.exports = (app) => {
  // Get tag mappings
  app.get('/api/tag-mappings', (req, res) => {
    const mappings = Array.from(tagToDepartmentMap.entries()).map(([tagId, departmentId]) => ({
      tagId,
      departmentId
    }));
    
    res.status(200).json(mappings);
  });

  // Add or update tag mapping
  app.post('/api/tag-mappings', (req, res) => {
    const { tagId, departmentId } = req.body;
    
    if (!tagId || !departmentId) {
      return res.status(400).json({ error: 'Both tagId and departmentId are required' });
    }
    
    tagToDepartmentMap.set(tagId, departmentId);
    
    // Broadcast updated tag mappings to all clients
    const tagMappings = Array.from(tagToDepartmentMap.entries()).map(([tag, dept]) => ({
      tagId: tag,
      departmentId: dept
    }));
    req.io.emit('tag_mappings_updated', tagMappings);
    
    res.status(200).json({ tagId, departmentId });
  });

  // Delete tag mapping
  app.delete('/api/tag-mappings/:tagId', (req, res) => {
    const { tagId } = req.params;
    
    if (!tagId) {
      return res.status(400).json({ error: 'TagId is required' });
    }
    
    const success = clearTagMapping(tagId);
    
    if (success) {
      // Broadcast updated tag mappings to all clients
      const tagMappings = Array.from(tagToDepartmentMap.entries()).map(([tag, dept]) => ({
        tagId: tag,
        departmentId: dept
      }));
      req.io.emit('tag_mappings_updated', tagMappings);
      
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Tag mapping not found' });
    }
  });

  // Get reader-to-department mappings
  app.get('/api/reader-mappings', (req, res) => {
    const mappings = Array.from(readerToDepartmentMap.entries()).map(([readerId, departmentId]) => ({
      readerId,
      departmentId
    }));
    
    res.status(200).json(mappings);
  });

  // Add or update reader-to-department mapping
  app.post('/api/reader-mappings', (req, res) => {
    const { readerId, departmentId } = req.body;
    
    if (!readerId || !departmentId) {
      return res.status(400).json({ error: 'Both readerId and departmentId are required' });
    }
    
    updateReaderToDepartment(readerId, departmentId);
    
    // Broadcast updated reader mappings to all clients
    const readerMappings = Array.from(readerToDepartmentMap.entries()).map(([reader, dept]) => ({
      readerId: reader,
      departmentId: dept
    }));
    req.io.emit('reader_mappings_updated', readerMappings);
    
    res.status(200).json({ readerId, departmentId });
  });

  // Get antenna-to-station mappings
  app.get('/api/antenna-mappings', (req, res) => {
    res.status(200).json(antennaToStationMap);
  });

  // Update antenna-to-station mapping
  app.post('/api/antenna-mappings', (req, res) => {
    const { departmentId, antennaNumber, stationIndex } = req.body;
    
    if (!departmentId || !antennaNumber || stationIndex === undefined) {
      return res.status(400).json({
        error: 'departmentId, antennaNumber, and stationIndex are all required'
      });
    }
    
    updateAntennaToStation(departmentId, antennaNumber, stationIndex);
    
    // Broadcast updated antenna mappings
    req.io.emit('antenna_mappings_updated', antennaToStationMap);
    
    res.status(200).json({
      departmentId,
      antennaNumber,
      stationIndex
    });
  });
};
