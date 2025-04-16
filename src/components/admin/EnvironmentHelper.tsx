
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, Copy, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import environmentUtils from '@/utils/environmentUtils';

export default function EnvironmentHelper() {
  const [copied, setCopied] = useState(false);
  const [currentEnv, setCurrentEnv] = useState('local');
  
  useEffect(() => {
    // Determine current environment
    if (environmentUtils.isLovableEnvironment()) {
      setCurrentEnv('lovable');
    } else if (environmentUtils.isTestEnvironment()) {
      setCurrentEnv('test');
    } else if (environmentUtils.isLocalEnvironment()) {
      setCurrentEnv('local');
    } else {
      setCurrentEnv('production');
    }
  }, []);
  
  const envVarsExample = `
# RFID Connection Settings
VITE_USE_MOCK_API=false
VITE_RFID_SERVER_URL=http://your-rfid-server:8000

# MQTT Configuration (if needed)
VITE_MQTT_BROKER_URL=indigoalkali-lr5usy.a01.euc1.aws.hivemq.cloud
VITE_MQTT_PORT=8883
VITE_MQTT_USERNAME=your-mqtt-username
VITE_MQTT_PASSWORD=your-mqtt-password
VITE_MQTT_TOPIC_PREFIX=JBH/
VITE_MQTT_USE_TLS=true
`.trim();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envVarsExample).then(() => {
      setCopied(true);
      toast.success('Environment variables copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Environment Configuration Helper</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Environment variables to configure for real RFID hardware connection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Current environment: <span className="font-semibold">{currentEnv}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Required Environment Variables</h3>
            <div className="bg-muted p-3 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {envVarsExample}
              </pre>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Configuration Instructions:</h3>
            <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
              <li>Create a <code>.env.local</code> file in your project root</li>
              <li>Copy the variables above and set appropriate values</li>
              <li>Set <code>VITE_USE_MOCK_API=false</code> to connect to real hardware</li>
              <li>Set <code>VITE_RFID_SERVER_URL</code> to your WebSocket server address</li>
              <li>Restart your application</li>
            </ol>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Environment Variables
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
