
/**
 * Centralized MQTT topic definitions
 * Compatible with AWS IoT Core and other MQTT brokers
 */
module.exports = {
  // Main topics
  TAG_DATA_TOPIC: 'rfid/tagdata',
  CONTROL_TOPIC: 'rfid/control',
  
  // Department-specific topics
  JEWELERS_TOPIC: 'rfid/departments/jewelers',
  DESIGNERS_TOPIC: 'rfid/departments/designers',
  SETTERS_TOPIC: 'rfid/departments/setters',
  POLISHER_TOPIC: 'rfid/departments/polisher',
  
  // System topics
  SYSTEM_STATUS_TOPIC: 'rfid/system/status',
  
  // Get all topics as an array for subscription
  getAllTopics: function() {
    return [
      this.TAG_DATA_TOPIC,
      this.CONTROL_TOPIC,
      this.JEWELERS_TOPIC,
      this.DESIGNERS_TOPIC,
      this.SETTERS_TOPIC,
      this.POLISHER_TOPIC,
      this.SYSTEM_STATUS_TOPIC
    ];
  }
};
