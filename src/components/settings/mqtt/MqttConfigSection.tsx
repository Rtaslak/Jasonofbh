
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MqttStatusToggle } from './MqttStatusToggle';
import { BrokerConfigFields } from './BrokerConfigFields';
import { TopicConfigFields } from './TopicConfigFields';
import { ConfigActionButtons } from './ConfigActionButtons';
import { useMqttConfig } from './useMqttConfig';

export default function MqttConfigSection() {
  const {
    config,
    connectionStatus,
    isTesting,
    handleChange,
    handleSaveConfig,
    handleTestConnection,
    toggleConnection
  } = useMqttConfig();

  return (
    <Card>
      <CardHeader>
        <CardTitle>MQTT Connection</CardTitle>
        <CardDescription>
          Configure the connection to your MQTT broker for RFID readers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MqttStatusToggle 
          connectionStatus={connectionStatus}
          onToggle={toggleConnection}
        />
        
        <Separator />
        
        <BrokerConfigFields 
          config={config}
          onChange={handleChange}
        />
        
        <TopicConfigFields
          config={config}
          onChange={handleChange}
        />
        
        <ConfigActionButtons
          isTesting={isTesting}
          onTest={handleTestConnection}
          onSave={handleSaveConfig}
        />
      </CardContent>
    </Card>
  );
}
