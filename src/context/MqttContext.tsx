
// This file is kept for backward compatibility
// It re-exports the new modular implementation

import MqttContext, { MqttProvider, useMqtt } from './mqtt/MqttContext';
import type { ConnectionStatus } from './mqtt/types';

export { MqttProvider, useMqtt };
export type { ConnectionStatus };
export default MqttContext;
