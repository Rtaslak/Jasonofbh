
import { stationToDepartmentMapping } from '../config';

/**
 * Map a station/reader ID to a department ID
 * @param stationId The station or reader ID
 * @returns The corresponding department ID or default (2 - jewelers)
 */
export function mapStationToDepartment(stationId: string): number {
  return stationToDepartmentMapping[stationId] || 2; // Default to jewelers
}

/**
 * Extract department ID from topic name
 * @param topic The MQTT topic
 * @returns The department ID or default (2 - jewelers)
 */
export function getDepartmentFromTopic(topic: string): number {
  if (topic.includes('jewelers/')) return 2;
  if (topic.includes('designers/')) return 1;
  if (topic.includes('setters/')) return 3;
  if (topic.includes('polisher/')) return 4;
  if (topic.includes('diamondCounting/')) return 5;
  if (topic.includes('shipping/')) return 6;
  return 2; // Default to jewelers
}
