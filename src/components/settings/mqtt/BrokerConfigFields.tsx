
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MqttConfig } from '@/services/rfid/types';
import { Lock } from 'lucide-react';

interface BrokerConfigFieldsProps {
  config: MqttConfig;
  onChange: (field: keyof MqttConfig, value: string | number | boolean) => void;
}

export function BrokerConfigFields({ config, onChange }: BrokerConfigFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="mqtt-broker">MQTT Broker URL</Label>
        <Input 
          id="mqtt-broker" 
          value={config.brokerUrl} 
          onChange={(e) => onChange('brokerUrl', e.target.value)} 
          placeholder="indigoalkali-lr5usy.a01.euc1.aws.hivemq.cloud"
        />
        <p className="text-xs text-muted-foreground">
          The MQTT broker hostname (e.g., indigoalkali-lr5usy.a01.euc1.aws.hivemq.cloud)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mqtt-port">MQTT Port</Label>
        <Input 
          id="mqtt-port" 
          value={config.port} 
          onChange={(e) => onChange('port', parseInt(e.target.value))} 
          type="number"
          placeholder="8883"
        />
        <p className="text-xs text-muted-foreground">
          The port for the MQTT broker (e.g., 8883 for TLS, 1883 for non-TLS)
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mqtt-username">Username</Label>
          <Input 
            id="mqtt-username" 
            value={config.username} 
            onChange={(e) => onChange('username', e.target.value)} 
            placeholder="MQTT username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mqtt-password">Password</Label>
          <div className="relative">
            <Input 
              id="mqtt-password" 
              type="password"
              value={config.password} 
              onChange={(e) => onChange('password', e.target.value)} 
              placeholder="MQTT password"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </>
  );
}
