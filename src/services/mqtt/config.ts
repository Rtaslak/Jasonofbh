
import { MqttConfig } from './types';

// Default configuration updated with JBH/ prefix
export const defaultConfig: MqttConfig = {
  brokerUrl: import.meta.env.VITE_MQTT_BROKER_URL || 'cyanqueen-lr5usy.a01.euc1.aws.hivemq.cloud',
  username: import.meta.env.VITE_MQTT_USERNAME || '',
  password: import.meta.env.VITE_MQTT_PASSWORD || '',
  clientId: `jewelry-dashboard-${Math.random().toString(16).substring(2, 10)}`,
  topicPrefix: import.meta.env.VITE_MQTT_TOPIC_PREFIX || 'JBH/', // Updated default prefix
  useTls: import.meta.env.VITE_MQTT_USE_TLS === 'false' ? false : true,
  port: parseInt(import.meta.env.VITE_MQTT_PORT || '8883') || 8883,
};

// Simple mapping of station IDs to department IDs
export const stationToDepartmentMapping: Record<string, number> = {
  // Map Zebra FX reader hostnames to departments
  'FX96006e8f12': 2,  // Jewelers department
  'Fx96006e8fB7': 3,  // Setters department
  
  // Legacy mappings for compatibility
  'designer-station1': 1,
  'designer-station2': 1,
  'jeweler-roger': 2,
  'jeweler-tro': 2,
  'jeweler-vicken': 2,
  'jeweler-simon': 2,
  'jeweler-hratch': 2,
  'jeweler-ara': 2,
  'jeweler-hrant': 2,
  'jeweler-ardziv': 2,
  'polisher-station': 4,
  'diamond-counting': 5,
  'shipping-station': 6
};

// Helper function to get department ID from reader ID
export function getDepartmentForReader(readerId: string): number {
  return stationToDepartmentMapping[readerId] || 2; // Default to jewelers
}

// Standard topics that should be subscribed to - updated to use the JBH/ prefix
export const standardTopics = [
  'JBH/jewelers/tagdata',  
  'JBH/designers/tagdata', 
  'JBH/setters/tagdata'
];

// Generate a client ID with random suffix
export function generateClientId(prefix: string = 'jewelry-dashboard'): string {
  return `${prefix}-${Math.random().toString(16).substring(2, 10)}`;
}
