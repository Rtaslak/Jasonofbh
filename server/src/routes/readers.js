
const { rfidReaders } = require('../mqtt');

module.exports = (app) => {
  // Get RFID readers
  app.get('/api/readers', (req, res) => {
    const readers = Array.from(rfidReaders.values());
    res.status(200).json(readers);
  });
};
