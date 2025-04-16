import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Save } from "lucide-react";

export default function RfidSettings({ readOnly = false }) {
  const [serverUrl, setServerUrl] = useState(
    localStorage.getItem("websocket_endpoint") || import.meta.env.VITE_RFID_SERVER_URL || "http://localhost:8000"
  );

  const handleSaveServerUrl = () => {
    localStorage.setItem("websocket_endpoint", serverUrl);
    toast.success("RFID server URL saved successfully");
  };

  const resetToDefault = () => {
    const defaultUrl = import.meta.env.VITE_RFID_SERVER_URL || "http://localhost:8000";
    setServerUrl(defaultUrl);
    localStorage.setItem("websocket_endpoint", defaultUrl);
    toast.info("RFID server URL reset to default");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">RFID System Settings</h2>
      <p className="text-muted-foreground">
        Configure your RFID hardware connections and settings
      </p>

      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="mqtt">MQTT Settings</TabsTrigger>
          <TabsTrigger value="readers">Readers</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>RFID Server Connection</CardTitle>
              <CardDescription>
                Configure the WebSocket server endpoint for real RFID hardware connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="server-url">WebSocket Server URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="server-url"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    placeholder="http://localhost:8000"
                    className="flex-1"
                    disabled={readOnly}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={resetToDefault}
                    title="Reset to default"
                    disabled={readOnly}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  The URL where your RFID WebSocket server is running
                </p>
              </div>

              <Button onClick={handleSaveServerUrl} className="mt-2" disabled={readOnly}>
                <Save className="h-4 w-4 mr-2" />
                Save Server URL
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mqtt" className="pt-4">
          {/* You can keep this section as is for MQTT settings */}
        </TabsContent>

        <TabsContent value="readers" className="pt-4">
          {/* Keep this section for Reader Management */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
