
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ConnectionStatus } from '@/context/MqttContext';

interface MqttStatusToggleProps {
  connectionStatus: ConnectionStatus;
  onToggle: () => void;
}

export function MqttStatusToggle({ connectionStatus, onToggle }: MqttStatusToggleProps) {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="mqtt-toggle">MQTT Status</Label>
        <p className="text-sm text-muted-foreground">
          {isConnected 
            ? 'Connected to MQTT broker' 
            : isConnecting 
              ? 'Connecting to MQTT broker...'
              : 'Disconnected from MQTT broker'}
        </p>
      </div>
      <Switch
        id="mqtt-toggle"
        checked={isConnected || isConnecting}
        onCheckedChange={onToggle}
        disabled={isConnecting}
      />
    </div>
  );
}
