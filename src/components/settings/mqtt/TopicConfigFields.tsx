
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MqttConfig } from '@/services/rfid/types';

interface TopicConfigFieldsProps {
  config: MqttConfig;
  onChange: (field: keyof MqttConfig, value: string | number | boolean) => void;
}

export function TopicConfigFields({ config, onChange }: TopicConfigFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mqtt-topic">MQTT Topic Prefix</Label>
        <Input 
          id="mqtt-topic" 
          value={config.topicPrefix} 
          onChange={(e) => onChange('topicPrefix', e.target.value)} 
          placeholder="JBH/"
        />
        <p className="text-xs text-muted-foreground">
          The prefix for MQTT topics to subscribe to
        </p>
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch
          id="tls-toggle"
          checked={config.useTls}
          onCheckedChange={(checked) => onChange('useTls', checked)}
        />
        <Label htmlFor="tls-toggle">Use TLS/SSL</Label>
        <p className="text-xs text-muted-foreground ml-2">
          Enable for secure connections (recommended)
        </p>
      </div>
    </>
  );
}
