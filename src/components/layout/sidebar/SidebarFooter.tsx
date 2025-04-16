import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useMqtt } from "@/context/MqttContext";

export default function SidebarFooter() {
  const { connectionStatus, connect } = useMqtt();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const isConnected = connectionStatus === 'connected';

  const handleStatusClick = async () => {
    if (!isConnected && !isReconnecting) {
      setIsReconnecting(true);
      setReconnectAttempts(prev => prev + 1);

      try {
        await connect();
        setIsReconnecting(false);
        setReconnectAttempts(0);
      } catch (error) {
        console.error('Reconnection failed:', error);
        toast.error('Failed to reconnect to RFID system');
        setIsReconnecting(false);
      }
    }
  };

  return (
    <div className="mt-auto py-4 px-3 border-t">
      <div className="flex justify-center items-center">
        <Badge 
          variant="outline"
          className={`flex items-center gap-2 border-none bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 cursor-pointer transition-colors`}
          onClick={handleStatusClick}
        >
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">RFID Connected</span>
            </>
          ) : isReconnecting ? (
            <>
              <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="text-xs font-medium text-yellow-500">Reconnecting...</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-red-500">RFID Not Connected</span>
            </>
          )}
        </Badge>
      </div>
    </div>
  );
}
